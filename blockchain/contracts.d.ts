/// <reference types="node" />
import { EthAddress } from '@barretenberg/address';
import { AssetId } from '@barretenberg/asset';
import { Asset, PriceFeed, SendTxOptions, TypedData } from '@barretenberg/blockchain';
import { TxHash } from '@barretenberg/tx_hash';
import { ethers } from 'ethers';
import { EthereumProvider } from './ethereum_provider';
import { GasPriceFeed } from './price_feed';
export declare class Contracts {
    private rollupContractAddress;
    private priceFeedContractAddresses;
    private confirmations;
    private rollupProcessor;
    private feeDistributorContract;
    private feeDistributorContractAddress;
    private verifierContractAddress;
    private assets;
    private gasPriceFeed;
    private priceFeeds;
    private provider;
    private signer;
    constructor(rollupContractAddress: EthAddress, priceFeedContractAddresses: EthAddress[], ethereumProvider: EthereumProvider, confirmations: number);
    init(): Promise<void>;
    setSupportedAsset(assetAddress: EthAddress, supportsPermit: boolean, signingAddress?: EthAddress): Promise<TxHash>;
    private getAssetValues;
    getPerRollupState(): Promise<{
        nextRollupId: number;
        dataRoot: Buffer;
        nullRoot: Buffer;
        rootRoot: Buffer;
        dataSize: number;
        totalDeposited: bigint[];
        totalWithdrawn: bigint[];
        totalFees: bigint[];
    }>;
    getPerBlockState(): Promise<{
        escapeOpen: boolean;
        numEscapeBlocksRemaining: number;
        totalPendingDeposit: bigint[];
        feeDistributorBalance: bigint[];
    }>;
    getRollupContractAddress(): EthAddress;
    getFeeDistributorContractAddress(): EthAddress;
    getVerifierContractAddress(): EthAddress;
    createEscapeHatchProofTx(proofData: Buffer, viewingKeys: Buffer[], signatures: Buffer[], signingAddress?: EthAddress): Promise<Buffer>;
    createRollupProofTx(proofData: Buffer, signatures: Buffer[], viewingKeys: Buffer[], providerSignature: Buffer, providerAddress: EthAddress, feeReceiver: EthAddress, feeLimit: bigint): Promise<Buffer>;
    sendTx(data: Buffer, options?: SendTxOptions): Promise<TxHash>;
    estimateGas(data: Buffer): Promise<number>;
    getRollupBlocksFrom(rollupId: number, minConfirmations?: number): Promise<import("@barretenberg/block_source").Block[]>;
    getUserPendingDeposit(assetId: AssetId, account: EthAddress): Promise<bigint>;
    getTransactionReceipt(txHash: TxHash): Promise<ethers.providers.TransactionReceipt>;
    getNetwork(): Promise<ethers.providers.Network>;
    getBlockNumber(): Promise<number>;
    signPersonalMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signTypedData(data: TypedData, address: EthAddress): Promise<import("@barretenberg/blockchain").EthereumSignature>;
    getAssets(): Asset[];
    getAsset(assetId: AssetId): Asset;
    getAssetPrice(assetId: AssetId): Promise<bigint>;
    getPriceFeed(assetId: AssetId): PriceFeed;
    getGasPriceFeed(): GasPriceFeed;
    getUserProofApprovalStatus(address: EthAddress, proofHash: string): Promise<boolean>;
    isContract(address: EthAddress): Promise<boolean>;
}
//# sourceMappingURL=contracts.d.ts.map