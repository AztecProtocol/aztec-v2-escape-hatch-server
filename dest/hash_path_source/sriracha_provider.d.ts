/// <reference types="node" />
import { HashPath } from './../../barretenberg.js/merkle_tree';
import { HashPathSource } from './hash_path_source';
export declare class SrirachaProvider implements HashPathSource {
    private baseUrl;
    constructor(baseUrl: URL);
    getStatus(): Promise<{
        blockchainStatus: import("../../barretenberg.js/blockchain").BlockchainStatus;
    }>;
    getTreeState(treeIndex: number): Promise<{
        root: Buffer;
        size: bigint;
    }>;
    getHashPath(treeIndex: number, index: bigint): Promise<HashPath>;
    getHashPaths(treeIndex: number, additions: {
        index: bigint;
        value: Buffer;
    }[]): Promise<{
        oldRoot: Buffer;
        newHashPaths: HashPath[];
        oldHashPaths: HashPath[];
        newRoots: Buffer[];
    }>;
}
//# sourceMappingURL=sriracha_provider.d.ts.map