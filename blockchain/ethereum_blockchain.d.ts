/// <reference types="node" />
import { EthereumProvider } from './ethereum_provider';
import { EthAddress } from '@barretenberg/address';
import { AssetId } from '@barretenberg/asset';
import { EventEmitter } from 'events';
import { Blockchain, BlockchainStatus, Receipt, SendTxOptions, TypedData } from '@barretenberg/blockchain';
import { Contracts } from './contracts';
import { TxHash } from '@barretenberg/tx_hash';
export interface EthereumBlockchainConfig {
    console?: boolean;
    gasLimit?: number;
    minConfirmation?: number;
    minConfirmationEHW?: number;
    pollInterval?: number;
}
export declare class EthereumBlockchain extends EventEmitter implements Blockchain {
    private config;
    private contracts;
    private running;
    private latestEthBlock;
    private latestRollupId;
    private debug;
    private status;
    private static readonly DEFAULT_MIN_CONFIRMATIONS;
    private static readonly DEFAULT_MIN_CONFIRMATIONS_EHW;
    constructor(config: EthereumBlockchainConfig, contracts: Contracts);
    static new(config: EthereumBlockchainConfig, rollupContractAddress: EthAddress, priceFeedContractAddresses: EthAddress[], provider: EthereumProvider): Promise<EthereumBlockchain>;
    init(): Promise<void>;
    /**
     * Start polling for RollupProcessed events.
     * All historical blocks will have been emitted before this function returns.
     */
    start(fromRollup?: number): Promise<void>;
    /**
     * Stop polling for RollupProcessed events
     */
    stop(): Promise<void>;
    /**
     * Get the status of the rollup contract
     */
    getBlockchainStatus(refresh?: boolean): Promise<BlockchainStatus>;
    private initStatus;
    private updatePerRollupState;
    private updatePerBlockState;
    getLatestRollupId(): number;
    getUserPendingDeposit(assetId: AssetId, account: EthAddress): Promise<bigint>;
    getUserProofApprovalStatus(account: EthAddress, signingData: Buffer): Promise<boolean>;
    setSupportedAsset(assetAddress: EthAddress, supportsPermit: boolean, signingAddress: EthAddress): Promise<TxHash>;
    createRollupProofTx(proofData: Buffer, signatures: Buffer[], viewingKeys: Buffer[], providerSignature: Buffer, providerAddress: EthAddress, feeReceiver: EthAddress, feeLimit: bigint): Promise<Buffer>;
    createEscapeHatchProofTx(proofData: Buffer, viewingKeys: Buffer[], depositSignature?: Buffer, signingAddress?: EthAddress): Promise<Buffer>;
    sendTx(tx: Buffer, options?: SendTxOptions): Promise<TxHash>;
    private getRequiredConfirmations;
    /**
     * Get all created rollup blocks from `rollupId`.
     */
    getBlocks(rollupId: number): Promise<import("@barretenberg/block_source").Block[]>;
    /**
     * Wait for given transaction to be mined, and return receipt.
     */
    getTransactionReceipt(txHash: TxHash): Promise<Receipt>;
    getTransactionReceiptSafe(txHash: TxHash): Promise<Receipt>;
    /**
     * Validate locally that a signature was produced by a publicOwner
     */
    validateSignature(publicOwner: EthAddress, signature: Buffer, signingData: Buffer): boolean;
    signPersonalMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signTypedData(data: TypedData, address: EthAddress): Promise<import("@barretenberg/blockchain").EthereumSignature>;
    getAsset(assetId: AssetId): import("@barretenberg/blockchain").Asset;
    getAssetPrice(assetId: AssetId): Promise<bigint>;
    getPriceFeed(assetId: AssetId): import("@barretenberg/blockchain").PriceFeed;
    getGasPriceFeed(): import("./price_feed").GasPriceFeed;
    isContract(address: EthAddress): Promise<boolean>;
    estimateGas(data: Buffer): Promise<number>;
}
//# sourceMappingURL=ethereum_blockchain.d.ts.map