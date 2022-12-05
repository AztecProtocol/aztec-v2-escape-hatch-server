"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("./../barretenberg.js/address");
const fifo_1 = require("./../barretenberg.js/fifo");
const rollup_proof_1 = require("./../barretenberg.js/rollup_proof");
const bigint_buffer_1 = require("bigint-buffer");
const fs_extra_1 = require("fs-extra");
class Server {
    constructor(worldStateDb, blockchain) {
        this.worldStateDb = worldStateDb;
        this.blockchain = blockchain;
        this.queue = new fifo_1.MemoryFifo();
        this.serverState = { lastBlock: -1, rollupContractAddress: address_1.EthAddress.ZERO };
        this.ready = false;
    }
    async start() {
        console.log('Synchronising chain state...');
        await this.readState();
        await this.worldStateDb.start();
        // Processing all historical blocks.
        let blocks = await this.blockchain.getBlocks(this.serverState.lastBlock + 1);
        while (blocks.length) {
            for (const block of blocks) {
                await this.handleBlock(block);
            }
            blocks = await this.blockchain.getBlocks(this.serverState.lastBlock + 1);
        }
        await this.writeState();
        // Subscribe for new blocks.
        this.blockchain.on('block', (b) => this.queue.put(async () => {
            await this.handleBlock(b);
            this.printState();
        }));
        this.blockchain.start(this.serverState.lastBlock + 1);
        this.queue.process(fn => fn());
        this.printState();
        this.ready = true;
    }
    async stop() {
        this.queue.cancel();
        this.blockchain.stop();
    }
    isReady() {
        return this.ready;
    }
    async readState() {
        if (await fs_extra_1.pathExists('./data/server_state')) {
            this.serverState = await fs_extra_1.readJson('./data/server_state');
        }
    }
    async writeState() {
        await fs_extra_1.writeJson('./data/server_state', this.serverState);
    }
    async getStatus() {
        return {
            blockchainStatus: await this.blockchain.getBlockchainStatus(),
        };
    }
    async getTreeState(treeIndex) {
        const size = this.worldStateDb.getSize(treeIndex);
        const root = this.worldStateDb.getRoot(treeIndex);
        return { size, root };
    }
    async getHashPath(treeIndex, index) {
        return new Promise(resolve => {
            this.queue.put(async () => resolve(await this.worldStateDb.getHashPath(treeIndex, index)));
        });
    }
    async getHashPaths(treeIndex, additions) {
        return new Promise(resolve => {
            this.queue.put(async () => resolve(await this.computeTempHashPaths(treeIndex, additions)));
        });
    }
    async computeTempHashPaths(treeIndex, additions) {
        const oldHashPaths = [];
        const newHashPaths = [];
        const newRoots = [];
        const oldRoot = this.worldStateDb.getRoot(treeIndex);
        for (const { index, value } of additions) {
            const oldHashPath = await this.worldStateDb.getHashPath(treeIndex, index);
            oldHashPaths.push(oldHashPath);
            await this.worldStateDb.put(treeIndex, index, value);
            const newHashPath = await this.worldStateDb.getHashPath(treeIndex, index);
            newHashPaths.push(newHashPath);
            newRoots.push(this.worldStateDb.getRoot(treeIndex));
        }
        await this.worldStateDb.rollback();
        return { oldHashPaths, newHashPaths, newRoots, oldRoot };
    }
    async handleBlock(block) {
        const { rollupProofData, viewingKeysData, rollupId } = block;
        const { dataStartIndex, innerProofData } = rollup_proof_1.RollupProofData.fromBuffer(rollupProofData, viewingKeysData);
        console.log(`Processing rollup ${rollupId}...`);
        for (let i = 0; i < innerProofData.length; ++i) {
            const tx = innerProofData[i];
            await this.worldStateDb.put(0, BigInt(dataStartIndex + i * 2), tx.newNote1);
            await this.worldStateDb.put(0, BigInt(dataStartIndex + i * 2 + 1), tx.newNote2);
            if (!tx.isPadding()) {
                await this.worldStateDb.put(1, bigint_buffer_1.toBigIntBE(tx.nullifier1), bigint_buffer_1.toBufferBE(1n, 64));
                await this.worldStateDb.put(1, bigint_buffer_1.toBigIntBE(tx.nullifier2), bigint_buffer_1.toBufferBE(1n, 64));
            }
        }
        await this.worldStateDb.put(2, BigInt(rollupId + 1), this.worldStateDb.getRoot(0));
        await this.worldStateDb.commit();
        this.serverState.lastBlock = rollupId;
        await this.writeState();
    }
    printState() {
        console.log(`Data size: ${this.worldStateDb.getSize(0)}`);
        console.log(`Data root: ${this.worldStateDb.getRoot(0).toString('hex')}`);
        console.log(`Null root: ${this.worldStateDb.getRoot(1).toString('hex')}`);
        console.log(`Root root: ${this.worldStateDb.getRoot(2).toString('hex')}`);
    }
}
exports.default = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBEQUEwRDtBQUcxRCxvREFBdUQ7QUFFdkQsb0VBQW9FO0FBRXBFLGlEQUF1RDtBQUN2RCx1Q0FBMkQ7QUFRM0QsTUFBcUIsTUFBTTtJQUt6QixZQUEyQixZQUEwQixFQUFVLFVBQXNCO1FBQTFELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUo3RSxVQUFLLEdBQUcsSUFBSSxpQkFBVSxFQUF1QixDQUFDO1FBQzlDLGdCQUFXLEdBQWdCLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixFQUFFLG9CQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckYsVUFBSyxHQUFHLEtBQUssQ0FBQztJQUVtRSxDQUFDO0lBRW5GLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUU1QyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEMsb0NBQW9DO1FBQ3BDLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0UsT0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3BCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUMxQixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFDRCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FB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SUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztDQUNGO0FBcElELHlCQW9JQyJ9