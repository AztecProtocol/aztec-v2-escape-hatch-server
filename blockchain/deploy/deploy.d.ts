#!/usr/bin/env node
import { Contract, Signer } from 'ethers';
export declare function deploy(escapeHatchBlockLower: number, escapeHatchBlockUpper: number, signer: Signer, initialFee?: string, feeDistributorAddress?: string, uniswapRouterAddress?: string, initialTokenSupply?: bigint, initialEthSupply?: bigint): Promise<{
    rollup: Contract;
    feeDistributor: Contract;
    uniswapRouter: Contract;
    priceFeeds: Contract[];
}>;
//# sourceMappingURL=deploy.d.ts.map