import { Web3Provider } from '@ethersproject/providers';
import { EthAddress } from '@barretenberg/address';
import { Asset, BlockchainAsset } from '@barretenberg/blockchain';
import { TxHash } from '@barretenberg/tx_hash';
import { EthereumProvider } from '../provider';
export declare class TokenAsset implements Asset {
    private ethersProvider;
    private info;
    private minConfirmations;
    private contract;
    private precision;
    constructor(ethersProvider: Web3Provider, info: BlockchainAsset, minConfirmations?: number);
    static fromAddress(address: EthAddress, ethersProvider: Web3Provider, permitSupport: boolean, minConfirmations?: number): Promise<TokenAsset>;
    getStaticInfo(): BlockchainAsset;
    getUserNonce(account: EthAddress): Promise<bigint>;
    balanceOf(account: EthAddress): Promise<bigint>;
    allowance(owner: EthAddress, receiver: EthAddress): Promise<bigint>;
    approve(value: bigint, owner: EthAddress, receiver: EthAddress, provider?: EthereumProvider): Promise<TxHash>;
    mint(value: bigint, account: EthAddress, provider?: EthereumProvider): Promise<TxHash>;
    fromBaseUnits(value: bigint, precision?: number): string;
    toBaseUnits(value: string): bigint;
    private getContractWithSigner;
}
//# sourceMappingURL=token_asset.d.ts.map