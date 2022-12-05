"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollupProcessor = void 0;
const address_1 = require("./../barretenberg.js/address");
const rollup_proof_1 = require("./../barretenberg.js/rollup_proof");
const tx_hash_1 = require("./../barretenberg.js/tx_hash");
const ethers_1 = require("ethers");
const RollupProcessor_json_1 = require("./artifacts/contracts/RollupProcessor.sol/RollupProcessor.json");
const solidity_format_signatures_1 = require("./solidity_format_signatures");
const fixEthersStackTrace = (err) => {
  err.stack += new Error().stack;
  throw err;
};
class RollupProcessor {
  constructor(rollupContractAddress, provider) {
    this.rollupContractAddress = rollupContractAddress;
    this.provider = provider;
    this.rollupProcessor = new ethers_1.ethers.Contract(
      rollupContractAddress.toString(),
      RollupProcessor_json_1.abi,
      this.provider
    );
  }
  get address() {
    return this.rollupContractAddress;
  }
  async feeDistributor() {
    return address_1.EthAddress.fromString(
      await this.rollupProcessor.feeDistributor()
    );
  }
  async verifier() {
    return address_1.EthAddress.fromString(
      await this.rollupProcessor.verifier()
    );
  }
  async nextRollupId() {
    return +(await this.rollupProcessor.nextRollupId());
  }
  async dataSize() {
    return +(await this.rollupProcessor.dataSize());
  }
  async dataRoot() {
    return Buffer.from((await this.rollupProcessor.dataRoot()).slice(2), "hex");
  }
  async nullRoot() {
    return Buffer.from((await this.rollupProcessor.nullRoot()).slice(2), "hex");
  }
  async rootRoot() {
    return Buffer.from((await this.rollupProcessor.rootRoot()).slice(2), "hex");
  }
  async totalDeposited() {
    return (await this.rollupProcessor.getTotalDeposited()).map((v) =>
      BigInt(v)
    );
  }
  async totalWithdrawn() {
    return (await this.rollupProcessor.getTotalWithdrawn()).map((v) =>
      BigInt(v)
    );
  }
  async totalFees() {
    return (await this.rollupProcessor.getTotalFees()).map((v) => BigInt(v));
  }
  async totalPendingDeposit() {
    return (await this.rollupProcessor.getTotalPendingDeposit()).map((v) =>
      BigInt(v)
    );
  }
  async getSupportedAssets() {
    const assetAddresses = await this.rollupProcessor.getSupportedAssets();
    return assetAddresses.map((a) => address_1.EthAddress.fromString(a));
  }
  async setSupportedAsset(assetAddress, supportsPermit, signer) {
    const rollupProcessor = this.getContractWithSigner(signer);
    const tx = await rollupProcessor.setSupportedAsset(
      assetAddress.toString(),
      supportsPermit
    );
    return tx_hash_1.TxHash.fromString(tx.hash);
  }
  async getAssetPermitSupport(assetId) {
    return this.rollupProcessor.getAssetPermitSupport(assetId);
  }
  async getEscapeHatchStatus() {
    const [
      escapeOpen,
      blocksRemaining,
    ] = await this.rollupProcessor.getEscapeHatchStatus();
    return { escapeOpen, blocksRemaining: +blocksRemaining };
  }
  async createEscapeHatchProofTx(proofData, viewingKeys, signatures, signer) {
    const rollupProcessor = this.getContractWithSigner(signer);
    const formattedSignatures = solidity_format_signatures_1.solidityFormatSignatures(
      signatures
    );
    const tx = await rollupProcessor.populateTransaction
      .escapeHatch(
        `0x${proofData.toString("hex")}`,
        formattedSignatures,
        Buffer.concat(viewingKeys)
      )
      .catch(fixEthersStackTrace);
    return Buffer.from(tx.data.slice(2), "hex");
  }
  async createRollupProofTx(
    proofData,
    signatures,
    viewingKeys,
    providerSignature,
    providerAddress,
    feeReceiver,
    feeLimit
  ) {
    const rollupProcessor = new ethers_1.Contract(
      this.rollupContractAddress.toString(),
      RollupProcessor_json_1.abi
    );
    const formattedSignatures = solidity_format_signatures_1.solidityFormatSignatures(
      signatures
    );
    const tx = await rollupProcessor.populateTransaction
      .processRollup(
        `0x${proofData.toString("hex")}`,
        formattedSignatures,
        Buffer.concat(viewingKeys),
        providerSignature,
        providerAddress.toString(),
        feeReceiver.toString(),
        feeLimit
      )
      .catch(fixEthersStackTrace);
    return Buffer.from(tx.data.slice(2), "hex");
  }
  async depositPendingFunds(assetId, amount, permitArgs, signer) {
    const rollupProcessor = this.getContractWithSigner(signer);
    const depositorAddress = await rollupProcessor.signer.getAddress();
    if (permitArgs) {
      const tx = await rollupProcessor
        .depositPendingFundsPermit(
          assetId,
          amount,
          depositorAddress,
          this.rollupProcessor.address,
          permitArgs.approvalAmount,
          permitArgs.deadline,
          permitArgs.signature.v,
          permitArgs.signature.r,
          permitArgs.signature.s,
          { value: assetId === 0 ? amount : undefined }
        )
        .catch(fixEthersStackTrace);
      return tx_hash_1.TxHash.fromString(tx.hash);
    } else {
      const tx = await rollupProcessor
        .depositPendingFunds(assetId, amount, depositorAddress, {
          value: assetId === 0 ? amount : undefined,
        })
        .catch(fixEthersStackTrace);
      return tx_hash_1.TxHash.fromString(tx.hash);
    }
  }
  async approveProof(proofHash, signer) {
    const rollupProcessor = this.getContractWithSigner(signer);
    const tx = await rollupProcessor
      .approveProof(proofHash)
      .catch(fixEthersStackTrace);
    return tx_hash_1.TxHash.fromString(tx.hash);
  }
  async getUserPendingDeposit(assetId, account) {
    return BigInt(
      await this.rollupProcessor.getUserPendingDeposit(
        assetId,
        account.toString()
      )
    );
  }
  async getUserProofApprovalStatus(address, proofHash) {
    return await this.rollupProcessor.depositProofApprovals(
      address.toString(),
      proofHash
    );
  }
  async getEarliestBlock() {
    const net = await this.provider.getNetwork();
    return net.chainId === 1 ? 11967192 : 0;
  }
  /**
   * Returns all rollup blocks from (and including) the given rollupId, with >= minConfirmations.
   *
   * A normal geth node has terrible performance when searching event logs. To ensure we are not dependent
   * on third party services such as Infura, we apply an algorithm to mitigate the poor performance.
   * The algorithm will search for rollup events from the end of the chain, in chunks of blocks.
   * If it finds a rollup <= to the given rollupId, we can stop searching.
   *
   * The worst case situation is when requesting all rollups from rollup 0, or when there are no events to find.
   * In this case, we will have ever degrading performance as we search from the end of the chain to the
   * block returned by getEarliestBlock() (hardcoded on mainnet). This is a rare case however.
   *
   * The more normal case is we're given a rollupId that is not 0. In this case we know an event must exist.
   * Further, the usage pattern is that anyone making the request will be doing so with an ever increasing rollupId.
   * This lends itself well to searching backwards from the end of the chain.
   *
   * The chunk size affects performance. If no previous query has been made, or the rollupId < the previous requested
   * rollupId, the chunk size is to 100,000. This is the case when the class is queried the first time.
   * 100,000 blocks is ~10 days of blocks, so assuming there's been a rollup in the last 10 days, or the client is not
   * over 10 days behind, a single query will suffice. Benchmarks suggest this will take ~2 seconds per chunk.
   *
   * If a previous query has been made and the rollupId >= previous query, the first chunk will be from the last result
   * rollups block to the end of the chain. This provides best performance for polling clients.
   */
  async getRollupBlocksFrom(rollupId, minConfirmations) {
    const earliestBlock = await this.getEarliestBlock();
    let end = await this.provider.getBlockNumber();
    const chunk = 100000;
    let start =
      this.lastQueriedRollupId === undefined ||
      rollupId < this.lastQueriedRollupId
        ? Math.max(end - chunk, 0)
        : this.lastQueriedRollupBlockNum;
    let events = [];
    while (end > earliestBlock) {
      const rollupFilter = this.rollupProcessor.filters.RollupProcessed();
      const rollupEvents = await this.rollupProcessor.queryFilter(
        rollupFilter,
        start,
        end
      );
      events = [...rollupEvents, ...events];
      if (events.length && events[0].args.rollupId.toNumber() <= rollupId) {
        this.lastQueriedRollupId = rollupId;
        this.lastQueriedRollupBlockNum = events[events.length - 1].blockNumber;
        break;
      }
      end = Math.max(start - 1, 0);
      start = Math.max(end - chunk, 0);
    }
    return this.getRollupBlocksFromEvents(
      events.filter((e) => e.args.rollupId.toNumber() >= rollupId),
      minConfirmations
    );
  }
  async getRollupBlocksFromEvents(rollupEvents, minConfirmations) {
    const meta = (
      await Promise.all(
        rollupEvents.map((event) =>
          Promise.all([
            event.getTransaction(),
            event.getBlock(),
            event.getTransactionReceipt(),
          ])
        )
      )
    ).filter((m) => m[0].confirmations >= minConfirmations);
    return meta.map((meta) =>
      this.decodeBlock({ ...meta[0], timestamp: meta[1].timestamp }, meta[2])
    );
  }
  /*
    async getRollupBlocksFrom(rollupId: number, minConfirmations: number) {
      const rollupFilter = this.rollupProcessor.filters.RollupProcessed(rollupId);
      const [rollupEvent] = await this.rollupProcessor.queryFilter(rollupFilter);
      if (!rollupEvent) {
        return [];
      }
      const filter = this.rollupProcessor.filters.RollupProcessed();
      const rollupEvents = await this.rollupProcessor.queryFilter(filter, rollupEvent.blockNumber);
      const txs = (await Promise.all(rollupEvents.map(event => event.getTransaction()))).filter(
        tx => tx.confirmations >= minConfirmations,
      );
      const receipts = await Promise.all(txs.map(tx => this.provider.getTransactionReceipt(tx.hash)));
      const blocks = await Promise.all(txs.map(tx => this.provider.getBlock(tx.blockNumber!)));
      return txs.map((tx, i) => this.decodeBlock({ ...tx, timestamp: blocks[i].timestamp }, receipts[0]));
    }
    */
  decodeBlock(tx, receipt) {
    const rollupAbi = new ethers_1.ethers.utils.Interface(
      RollupProcessor_json_1.abi
    );
    const result = rollupAbi.parseTransaction({ data: tx.data });
    const rollupProofData = Buffer.from(result.args.proofData.slice(2), "hex");
    const viewingKeysData = Buffer.from(
      result.args.viewingKeys.slice(2),
      "hex"
    );
    return {
      created: new Date(tx.timestamp * 1000),
      txHash: tx_hash_1.TxHash.fromString(tx.hash),
      rollupProofData,
      viewingKeysData,
      rollupId: rollup_proof_1.RollupProofData.getRollupIdFromBuffer(
        rollupProofData
      ),
      rollupSize: rollup_proof_1.RollupProofData.getRollupSizeFromBuffer(
        rollupProofData
      ),
      gasPrice: BigInt(tx.gasPrice.toString()),
      gasUsed: receipt.gasUsed.toNumber(),
    };
  }
  getContractWithSigner(signer) {
    const ethSigner = !signer
      ? this.provider.getSigner(0)
      : signer instanceof address_1.EthAddress
      ? this.provider.getSigner(signer.toString())
      : signer;
    return new ethers_1.Contract(
      this.rollupContractAddress.toString(),
      RollupProcessor_json_1.abi,
      ethSigner
    );
  }
}
exports.RollupProcessor = RollupProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbHVwX3Byb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yb2xsdXBfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGtEQUFrRDtBQUlsRCw0REFBNEQ7QUFDNUQsa0RBQThDO0FBQzlDLG1DQUF5RDtBQUN6RCx5R0FBa0c7QUFDbEcsNkVBQXdFO0FBRXhFLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxHQUFVLEVBQUUsRUFBRTtJQUN6QyxHQUFHLENBQUMsS0FBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2hDLE1BQU0sR0FBRyxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsTUFBYSxlQUFlO0lBSzFCLFlBQW9CLHFCQUFpQyxFQUFVLFFBQXNCO1FBQWpFLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDbkYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLEVBQUUsMEJBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLG9CQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUTtRQUNaLE9BQU8sb0JBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FB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
