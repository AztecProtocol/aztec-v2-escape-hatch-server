"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SrirachaProvider = void 0;
const blockchain_1 = require("./../../barretenberg.js/blockchain");
const iso_fetch_1 = require("./../../barretenberg.js/iso_fetch");
const merkle_tree_1 = require("./../../barretenberg.js/merkle_tree");
const bigint_buffer_1 = require("bigint-buffer");
class SrirachaProvider {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.toString().replace(/\/$/, '');
    }
    async getStatus() {
        const url = new URL(`${this.baseUrl}/status`);
        const response = await iso_fetch_1.fetch(url.toString()).catch(() => undefined);
        if (!response) {
            throw new Error('Failed to contact rollup provider.');
        }
        try {
            const body = await response.json();
            return {
                blockchainStatus: blockchain_1.blockchainStatusFromJson(body.blockchainStatus),
            };
        }
        catch (err) {
            throw new Error(`Bad response from: ${url}`);
        }
    }
    async getTreeState(treeIndex) {
        const response = await iso_fetch_1.fetch(`${this.baseUrl}/get-tree-state/${treeIndex}`);
        const { size, root } = (await response.json());
        return { root: Buffer.from(root, 'hex'), size: BigInt(size) };
    }
    async getHashPath(treeIndex, index) {
        const response = await iso_fetch_1.fetch(`${this.baseUrl}/get-hash-path/${treeIndex}/${index.toString()}`);
        const { hashPath } = (await response.json());
        return merkle_tree_1.HashPath.fromBuffer(Buffer.from(hashPath, 'hex'));
    }
    async getHashPaths(treeIndex, additions) {
        const body = additions.map(addition => {
            const { index, value } = addition;
            return { index: bigint_buffer_1.toBufferBE(index, 32).toString('hex'), value: value.toString('hex') };
        });
        const response = await iso_fetch_1.fetch(`${this.baseUrl}/get-hash-paths/${treeIndex}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const { oldRoot, newRoots, newHashPaths, oldHashPaths } = (await response.json());
        return {
            oldRoot: Buffer.from(oldRoot, 'hex'),
            newHashPaths: newHashPaths.map((p) => merkle_tree_1.HashPath.fromBuffer(Buffer.from(p, 'hex'))),
            oldHashPaths: oldHashPaths.map((p) => merkle_tree_1.HashPath.fromBuffer(Buffer.from(p, 'hex'))),
            newRoots: newRoots.map((r) => Buffer.from(r, 'hex')),
        };
    }
}
exports.SrirachaProvider = SrirachaProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JpcmFjaGFfcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFzaF9wYXRoX3NvdXJjZS9zcmlyYWNoYV9wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtRUFBOEU7QUFDOUUsaUVBQTBEO0FBQzFELHFFQUErRDtBQUMvRCxpREFBMkM7QUFRM0MsTUFBYSxnQkFBZ0I7SUFHM0IsWUFBWSxPQUFZO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxpQkFBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRW5DLE9BQU87Z0JBQ0wsZ0JBQWdCLEVBQUUscUNBQXdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2FBQ2xFLENBQUM7U0FDSDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQWlCO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQUssQ0FBQyxHQUFH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