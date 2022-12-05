"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumBlockchain = void 0;
const debug_1 = __importDefault(require("debug"));
const events_1 = require("events");
const contracts_1 = require("./contracts");
const validate_signature_1 = require("./validate_signature");
const hash_data_1 = require("./hash_data");
class EthereumBlockchain extends events_1.EventEmitter {
    constructor(config, contracts) {
        super();
        this.config = config;
        this.contracts = contracts;
        this.running = false;
        this.latestEthBlock = -1;
        this.latestRollupId = -1;
        this.debug = config.console === false ? debug_1.default('bb:ethereum_blockchain') : console.log;
    }
    static async new(config, rollupContractAddress, priceFeedContractAddresses, provider) {
        const confirmations = config.minConfirmation || EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS;
        const contracts = new contracts_1.Contracts(rollupContractAddress, priceFeedContractAddresses, provider, confirmations);
        await contracts.init();
        const eb = new EthereumBlockchain(config, contracts);
        await eb.init();
        return eb;
    }
    async init() {
        await this.initStatus();
        this.debug(`Ethereum blockchain initialized with assets: ${this.status.assets.map(a => a.symbol)}`);
    }
    /**
     * Start polling for RollupProcessed events.
     * All historical blocks will have been emitted before this function returns.
     */
    async start(fromRollup = 0) {
        this.debug(`Ethereum blockchain starting from rollup: ${fromRollup}`);
        const getBlocks = async (fromRollup) => {
            while (true) {
                try {
                    return await this.getBlocks(fromRollup);
                }
                catch (err) {
                    this.debug(`getBlocks failed, will retry: ${err.message}`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        };
        const emitBlocks = async () => {
            const latestBlock = await this.contracts.getBlockNumber().catch(err => {
                this.debug(`getBlockNumber failed: ${err.code}`);
                return this.latestEthBlock;
            });
            if (latestBlock === this.latestEthBlock) {
                return;
            }
            this.latestEthBlock = latestBlock;
            await this.updatePerBlockState();
            const blocks = await getBlocks(fromRollup);
            if (blocks.length) {
                await this.updatePerRollupState();
            }
            for (const block of blocks) {
                this.debug(`Block received: ${block.rollupId}`);
                this.latestRollupId = block.rollupId;
                this.emit('block', block);
                fromRollup = block.rollupId + 1;
            }
        };
        // We must have emitted all historical blocks before returning.
        await emitBlocks();
        // After which, we asynchronously kick off a polling loop for the latest blocks.
        this.running = true;
        (async () => {
            while (this.running) {
                await new Promise(resolve => setTimeout(resolve, this.config.pollInterval || 10000));
                await emitBlocks().catch(this.debug);
            }
        })();
    }
    /**
     * Stop polling for RollupProcessed events
     */
    async stop() {
        this.running = false;
        this.removeAllListeners();
    }
    /**
     * Get the status of the rollup contract
     */
    async getBlockchainStatus(refresh = false) {
        if (refresh) {
            await this.initStatus();
        }
        return this.status;
    }
    async initStatus() {
        await this.updatePerRollupState();
        await this.updatePerBlockState();
        const { chainId } = await this.contracts.getNetwork();
        const assets = this.contracts.getAssets().map(a => a.getStaticInfo());
        this.status = {
            ...this.status,
            chainId,
            rollupContractAddress: this.contracts.getRollupContractAddress(),
            feeDistributorContractAddress: this.contracts.getFeeDistributorContractAddress(),
            verifierContractAddress: this.contracts.getVerifierContractAddress(),
            assets,
        };
    }
    async updatePerRollupState() {
        this.status = {
            ...this.status,
            ...(await this.contracts.getPerRollupState()),
        };
    }
    async updatePerBlockState() {
        this.status = {
            ...this.status,
            ...(await this.contracts.getPerBlockState()),
        };
    }
    getLatestRollupId() {
        return this.latestRollupId;
    }
    async getUserPendingDeposit(assetId, account) {
        return this.contracts.getUserPendingDeposit(assetId, account);
    }
    async getUserProofApprovalStatus(account, signingData) {
        const proofHash = hash_data_1.hashData(signingData);
        return this.contracts.getUserProofApprovalStatus(account, proofHash);
    }
    async setSupportedAsset(assetAddress, supportsPermit, signingAddress) {
        return this.contracts.setSupportedAsset(assetAddress, supportsPermit, signingAddress);
    }
    async createRollupProofTx(proofData, signatures, viewingKeys, providerSignature, providerAddress, feeReceiver, feeLimit) {
        return await this.contracts.createRollupProofTx(proofData, signatures, viewingKeys, providerSignature, providerAddress, feeReceiver, feeLimit);
    }
    async createEscapeHatchProofTx(proofData, viewingKeys, depositSignature, signingAddress) {
        return await this.contracts.createEscapeHatchProofTx(proofData, viewingKeys, depositSignature ? [depositSignature] : [], signingAddress);
    }
    sendTx(tx, options = {}) {
        options = { ...options, gasLimit: options.gasLimit || this.config.gasLimit };
        return this.contracts.sendTx(tx, options);
    }
    getRequiredConfirmations() {
        const { escapeOpen, numEscapeBlocksRemaining } = this.status;
        const { minConfirmation = EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS, minConfirmationEHW = EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS_EHW, } = this.config;
        return escapeOpen || numEscapeBlocksRemaining <= minConfirmationEHW ? minConfirmationEHW : minConfirmation;
    }
    /**
     * Get all created rollup blocks from `rollupId`.
     */
    async getBlocks(rollupId) {
        const minConfirmations = this.getRequiredConfirmations();
        return await this.contracts.getRollupBlocksFrom(rollupId, minConfirmations);
    }
    /**
     * Wait for given transaction to be mined, and return receipt.
     */
    async getTransactionReceipt(txHash) {
        const confs = this.config.minConfirmation || EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS;
        this.debug(`Getting tx receipt for ${txHash}... (${confs} confirmations)`);
        let txReceipt = await this.contracts.getTransactionReceipt(txHash);
        while (!txReceipt || txReceipt.confirmations < confs) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            txReceipt = await this.contracts.getTransactionReceipt(txHash);
        }
        return { status: !!txReceipt.status, blockNum: txReceipt.blockNumber };
    }
    async getTransactionReceiptSafe(txHash) {
        const confs = this.getRequiredConfirmations();
        this.debug(`Getting tx receipt for ${txHash} (${confs} confs)...`);
        let txReceipt = await this.contracts.getTransactionReceipt(txHash);
        while (!txReceipt || txReceipt.confirmations < confs) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            txReceipt = await this.contracts.getTransactionReceipt(txHash);
        }
        return { status: !!txReceipt.status, blockNum: txReceipt.blockNumber };
    }
    /**
     * Validate locally that a signature was produced by a publicOwner
     */
    validateSignature(publicOwner, signature, signingData) {
        return validate_signature_1.validateSignature(publicOwner, signature, signingData);
    }
    async signPersonalMessage(message, address) {
        return this.contracts.signPersonalMessage(message, address);
    }
    async signMessage(message, address) {
        return this.contracts.signMessage(message, address);
    }
    async signTypedData(data, address) {
        return this.contracts.signTypedData(data, address);
    }
    getAsset(assetId) {
        return this.contracts.getAsset(assetId);
    }
    async getAssetPrice(assetId) {
        return this.contracts.getAssetPrice(assetId);
    }
    getPriceFeed(assetId) {
        return this.contracts.getPriceFeed(assetId);
    }
    getGasPriceFeed() {
        return this.contracts.getGasPriceFeed();
    }
    async isContract(address) {
        return this.contracts.isContract(address);
    }
    async estimateGas(data) {
        return this.contracts.estimateGas(data);
    }
}
exports.EthereumBlockchain = EthereumBlockchain;
EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS = 3;
EthereumBlockchain.DEFAULT_MIN_CONFIRMATIONS_EHW = 12;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoZXJldW1fYmxvY2tjaGFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ldGhlcmV1bV9ibG9ja2NoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLGtEQUFnQztBQUNoQyxtQ0FBc0M7QUFFdEMsMkNBQXdDO0FBRXhDLDZEQUF5RDtBQUN6RCwyQ0FBdUM7QUFVdkMsTUFBYSxrQkFBbUIsU0FBUSxxQkFBWTtJQVVsRCxZQUFvQixNQUFnQyxFQUFVLFNBQW9CO1FBQ2hGLEtBQUssRUFBRSxDQUFDO1FBRFUsV0FBTSxHQUFOLE1BQU0sQ0FBMEI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBVDFFLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsbUJBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixtQkFBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBUzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLGVBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQzlGLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDZCxNQUFnQyxFQUNoQyxxQkFBaUMsRUFDakMsMEJBQXdDLEVBQ3hDLFFBQTBCO1FBRTFCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxlQUFlLElBQUksa0JBQWtCLENBQUMseUJBQXlCLENBQUM7UUFDN0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLHFCQUFxQixFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM1RyxNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxNQUFNLEVBQUUsQ0FB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