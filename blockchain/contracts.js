"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const providers_1 = require("@ethersproject/providers");
const tx_hash_1 = require("./../barretenberg.js/tx_hash");
const ethers_1 = require("ethers");
const IFeeDistributor_json_1 = require("./artifacts/contracts/interfaces/IFeeDistributor.sol/IFeeDistributor.json");
const asset_1 = require("./asset");
const price_feed_1 = require("./price_feed");
const rollup_processor_1 = require("./rollup_processor");
const signer_1 = require("./signer");
class Contracts {
  constructor(
    rollupContractAddress,
    priceFeedContractAddresses,
    ethereumProvider,
    confirmations
  ) {
    this.rollupContractAddress = rollupContractAddress;
    this.priceFeedContractAddresses = priceFeedContractAddresses;
    this.confirmations = confirmations;
    this.provider = new providers_1.Web3Provider(ethereumProvider);
    this.signer = new signer_1.Web3Signer(this.provider);
    this.rollupProcessor = new rollup_processor_1.RollupProcessor(
      rollupContractAddress,
      this.provider
    );
  }
  async init() {
    this.feeDistributorContractAddress = await this.rollupProcessor.feeDistributor();
    this.verifierContractAddress = await this.rollupProcessor.verifier();
    this.feeDistributorContract = new ethers_1.ethers.Contract(
      this.feeDistributorContractAddress.toString(),
      IFeeDistributor_json_1.abi,
      this.provider
    );
    const assetAddresses = await this.rollupProcessor.getSupportedAssets();
    const tokenAssets = await Promise.all(
      assetAddresses.map(async (addr, i) =>
        asset_1.TokenAsset.fromAddress(
          addr,
          this.provider,
          await this.rollupProcessor.getAssetPermitSupport(i + 1),
          this.confirmations
        )
      )
    );
    this.assets = [new asset_1.EthAsset(this.provider), ...tokenAssets];
    const [
      gasPriceFeedAddress,
      ...tokenPriceFeedAddresses
    ] = this.priceFeedContractAddresses;
    if (gasPriceFeedAddress) {
      this.gasPriceFeed = new price_feed_1.GasPriceFeed(
        gasPriceFeedAddress,
        this.provider
      );
      this.priceFeeds = [
        new price_feed_1.EthPriceFeed(),
        ...tokenPriceFeedAddresses.map(
          (a) => new price_feed_1.TokenPriceFeed(a, this.provider)
        ),
      ];
    }
  }
  async setSupportedAsset(assetAddress, supportsPermit, signingAddress) {
    const signer = signingAddress
      ? this.provider.getSigner(signingAddress.toString())
      : this.provider.getSigner(0);
    const tx = await this.rollupProcessor.setSupportedAsset(
      assetAddress,
      supportsPermit,
      signer
    );
    const tokenAsset = await asset_1.TokenAsset.fromAddress(
      assetAddress,
      this.provider,
      supportsPermit
    );
    this.assets.push(tokenAsset);
    return tx;
  }
  async getAssetValues(promise) {
    const padding = Array(this.assets.length).fill(BigInt(0));
    return [...(await promise), ...padding].slice(0, padding.length);
  }
  async getPerRollupState() {
    const nextRollupId = await this.rollupProcessor.nextRollupId();
    const dataSize = await this.rollupProcessor.dataSize();
    const dataRoot = await this.rollupProcessor.dataRoot();
    const nullRoot = await this.rollupProcessor.nullRoot();
    const rootRoot = await this.rollupProcessor.rootRoot();
    const totalDeposited = await this.getAssetValues(
      this.rollupProcessor.totalDeposited()
    );
    const totalWithdrawn = await this.getAssetValues(
      this.rollupProcessor.totalWithdrawn()
    );
    const totalFees = await this.getAssetValues(
      this.rollupProcessor.totalFees()
    );
    return {
      nextRollupId,
      dataRoot,
      nullRoot,
      rootRoot,
      dataSize,
      totalDeposited,
      totalWithdrawn,
      totalFees,
    };
  }
  async getPerBlockState() {
    const {
      escapeOpen,
      blocksRemaining,
    } = await this.rollupProcessor.getEscapeHatchStatus();
    const totalPendingDeposit = await this.getAssetValues(
      this.rollupProcessor.totalPendingDeposit()
    );
    const feeDistributorBalance = [];
    for (let i = 0; i < this.assets.length; ++i) {
      feeDistributorBalance[i] = BigInt(
        await this.feeDistributorContract.txFeeBalance(i)
      );
    }
    return {
      escapeOpen,
      numEscapeBlocksRemaining: blocksRemaining,
      totalPendingDeposit,
      feeDistributorBalance,
    };
  }
  getRollupContractAddress() {
    return this.rollupContractAddress;
  }
  getFeeDistributorContractAddress() {
    return this.feeDistributorContractAddress;
  }
  getVerifierContractAddress() {
    return this.verifierContractAddress;
  }
  async createEscapeHatchProofTx(
    proofData,
    viewingKeys,
    signatures,
    signingAddress
  ) {
    return this.rollupProcessor.createEscapeHatchProofTx(
      proofData,
      viewingKeys,
      signatures,
      signingAddress
    );
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
    return this.rollupProcessor.createRollupProofTx(
      proofData,
      signatures,
      viewingKeys,
      providerSignature,
      providerAddress,
      feeReceiver,
      feeLimit
    );
  }
  async sendTx(data, options = {}) {
    const { signingAddress, gasLimit } = options;
    const signer = signingAddress
      ? this.provider.getSigner(signingAddress.toString())
      : this.provider.getSigner(0);
    const from = await signer.getAddress();
    const txRequest = {
      to: this.rollupContractAddress.toString(),
      from,
      gasLimit,
      data,
    };
    const txResponse = await signer.sendTransaction(txRequest);
    return tx_hash_1.TxHash.fromString(txResponse.hash);
  }
  async estimateGas(data) {
    const signer = this.provider.getSigner(0);
    const from = await signer.getAddress();
    const txRequest = {
      to: this.rollupContractAddress.toString(),
      from,
      data,
    };
    const estimate = await this.provider.estimateGas(txRequest);
    return estimate.toNumber();
  }
  async getRollupBlocksFrom(rollupId, minConfirmations = this.confirmations) {
    return this.rollupProcessor.getRollupBlocksFrom(rollupId, minConfirmations);
  }
  async getUserPendingDeposit(assetId, account) {
    return this.rollupProcessor.getUserPendingDeposit(assetId, account);
  }
  async getTransactionReceipt(txHash) {
    return this.provider.getTransactionReceipt(txHash.toString());
  }
  async getNetwork() {
    return this.provider.getNetwork();
  }
  async getBlockNumber() {
    return this.provider.getBlockNumber();
  }
  async signPersonalMessage(message, address) {
    return this.signer.signPersonalMessage(message, address);
  }
  async signMessage(message, address) {
    return this.signer.signMessage(message, address);
  }
  async signTypedData(data, address) {
    return this.signer.signTypedData(data, address);
  }
  getAssets() {
    return this.assets;
  }
  getAsset(assetId) {
    return this.assets[assetId];
  }
  async getAssetPrice(assetId) {
    return this.priceFeeds[assetId].price();
  }
  getPriceFeed(assetId) {
    return this.priceFeeds[assetId];
  }
  getGasPriceFeed() {
    return this.gasPriceFeed;
  }
  async getUserProofApprovalStatus(address, proofHash) {
    return this.rollupProcessor.getUserProofApprovalStatus(address, proofHash);
  }
  async isContract(address) {
    return (await this.provider.getCode(address.toString())) !== "0x";
  }
}
exports.Contracts = Contracts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbnRyYWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3REFBd0Q7QUFJeEQsa0RBQThDO0FBQzlDLG1DQUEwQztBQUMxQyxvSEFBcUg7QUFDckgsbUNBQStDO0FBRS9DLDZDQUEwRTtBQUMxRSx5REFBcUQ7QUFDckQscUNBQXNDO0FBRXRDLE1BQWEsU0FBUztJQVdwQixZQUNVLHFCQUFpQyxFQUNqQywwQkFBd0MsRUFDaEQsZ0JBQWtDLEVBQzFCLGFBQXFCO1FBSHJCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBWTtRQUNqQywrQkFBMEIsR0FBMUIsMEJBQTBCLENBQWM7UUFFeEMsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFFN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGtDQUFlLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakYsSUFBSSxDQUFDLHVCQUF1QixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxlQUFNLENBQUMsUUFBUSxDQUMvQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsUUFBUSxFQUFFLEVBQzdDLDBCQUFpQixFQUNqQixJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxNQUFN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
