/// <reference types="node" />
import { Blockchain } from './../barretenberg.js/blockchain';
import { HashPath } from './../barretenberg.js/merkle_tree';
import { WorldStateDb } from './../barretenberg.js/world_state_db';
import { GetHashPathsResponse, HashPathSource } from './hash_path_source';
export default class Server implements HashPathSource {
    private worldStateDb;
    private blockchain;
    private queue;
    private serverState;
    private ready;
    constructor(worldStateDb: WorldStateDb, blockchain: Blockchain);
    start(): Promise<void>;
    stop(): Promise<void>;
    isReady(): boolean;
    private readState;
    private writeState;
    getStatus(): Promise<{
        blockchainStatus: import("../barretenberg.js/blockchain").BlockchainStatus;
    }>;
    getTreeState(treeIndex: number): Promise<{
        size: bigint;
        root: Buffer;
    }>;
    getHashPath(treeIndex: number, index: bigint): Promise<HashPath>;
    getHashPaths(treeIndex: number, additions: {
        index: bigint;
        value: Buffer;
    }[]): Promise<GetHashPathsResponse>;
    computeTempHashPaths(treeIndex: number, additions: {
        index: bigint;
        value: Buffer;
    }[]): Promise<{
        oldHashPaths: HashPath[];
        newHashPaths: HashPath[];
        newRoots: Buffer[];
        oldRoot: Buffer;
    }>;
    private handleBlock;
    private printState;
}
//# sourceMappingURL=server.d.ts.map