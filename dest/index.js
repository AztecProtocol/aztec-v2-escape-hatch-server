"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register"); // 👈 add this one
const address_1 = require("./../barretenberg.js/address");
const world_state_db_1 = require("./../barretenberg.js/world_state_db");
const blockchain_1 = require("./../blockchain");
const ethers_1 = require("ethers");
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const app_1 = require("./app");
const server_1 = __importDefault(require("./server"));
require("log-timestamp");
const fs_extra_1 = require("fs-extra");
const { PORT = '8082', ROLLUP_CONTRACT_ADDRESS = "0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba", ETHEREUM_HOST = 'http://localhost:8545', API_PREFIX = '', INFURA_API_KEY, NETWORK, MIN_CONFIRMATION_ESCAPE_HATCH_WINDOW, } = process.env;
function getEthereumBlockchainConfig() {
    const minConfirmationEHW = MIN_CONFIRMATION_ESCAPE_HATCH_WINDOW ? +MIN_CONFIRMATION_ESCAPE_HATCH_WINDOW : undefined;
    if (INFURA_API_KEY && NETWORK && ROLLUP_CONTRACT_ADDRESS) {
        console.log(`Infura network: ${NETWORK}`);
        console.log(`Rollup contract address: ${ROLLUP_CONTRACT_ADDRESS}`);
        const provider = new blockchain_1.EthersAdapter(new ethers_1.ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY));
        const ethConfig = { minConfirmationEHW };
        return { provider, ethConfig };
    }
    else if (ETHEREUM_HOST && ROLLUP_CONTRACT_ADDRESS) {
        console.log(`Ethereum host: ${ETHEREUM_HOST}`);
        console.log(`Rollup contract address: ${ROLLUP_CONTRACT_ADDRESS}`);
        const provider = new blockchain_1.EthersAdapter(new ethers_1.ethers.providers.JsonRpcProvider(ETHEREUM_HOST));
        const ethConfig = { minConfirmationEHW };
        return { provider, ethConfig };
    }
    throw new Error('Config incorrect');
}
async function checkState() {
    if (await fs_extra_1.pathExists('./data/state')) {
        const { rollupContractAddress: storedRollupAddress } = await fs_extra_1.readJson('./data/state');
        // Erase all data if rollup contract changes.
        if (storedRollupAddress !== ROLLUP_CONTRACT_ADDRESS) {
            console.log(`Rollup contract changed, erasing data: ${storedRollupAddress} -> ${ROLLUP_CONTRACT_ADDRESS}`);
            await fs_extra_1.emptyDir('./data');
        }
    }
    await fs_extra_1.mkdirp('./data');
    await fs_extra_1.writeJson('./data/state', { rollupContractAddress: ROLLUP_CONTRACT_ADDRESS });
}
async function main() {
    await checkState();
    const shutdown = async () => process.exit(0);
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    const worldStateDb = new world_state_db_1.WorldStateDb();
    const { provider, ethConfig } = getEthereumBlockchainConfig();
    if (!ethConfig) {
        throw new Error('No ethereum config.');
    }
    const ethereumBlockchain = await blockchain_1.EthereumBlockchain.new(ethConfig, address_1.EthAddress.fromString(ROLLUP_CONTRACT_ADDRESS), [], provider);
    const server = new server_1.default(worldStateDb, ethereumBlockchain);
    const app = app_1.appFactory(server, API_PREFIX);
    const httpServer = http_1.default.createServer(app.callback());
    httpServer.listen(PORT);
    console.log(`Server listening on port ${PORT}.`);
    await server.start();
}
main().catch(console.log);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBK0IsQ0FBQyxrQkFBa0I7QUFDbEQsMERBQTBEO0FBQzFELHdFQUFtRTtBQUNuRSxnREFBb0U7QUFDcEUsbUNBQWdDO0FBQ2hDLGdEQUF3QjtBQUN4Qiw0QkFBMEI7QUFDMUIsK0JBQW1DO0FBQ25DLHNEQUE4QjtBQUM5Qix5QkFBdUI7QUFDdkIsdUNBQTZFO0FBRTdFLE1BQU0sRUFDSixJQUFJLEdBQUcsTUFBTSxFQUNiLHVCQUF1QixHQUFHLDRDQUE0QyxFQUN0RSxhQUFhLEdBQUcsdUJBQXVCLEVBQ3ZDLFVBQVUsR0FBRyxFQUFFLEVBQ2YsY0FBYyxFQUNkLE9BQU8sRUFDUCxvQ0FBb0MsR0FDckMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRWhCLFNBQVMsMkJBQTJCO0lBQ2xDLE1BQU0sa0JBQWtCLEdBQUcsb0NBQW9DLENBQUMsQ0FBQyxDQUFDLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwSCxJQUFJLGNBQWMsSUFBSSxPQUFPLElBQUksdUJBQXVCLEVBQUU7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0Qix1QkFBdUIsRUFBRSxDQUFDLENBQUM7UUFDbkUsTUFBTSxRQUFRLEdBQUcsSUFBSSwwQkFBYSxDQUFDLElBQUksZUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDakcsTUFBTSxTQUFTLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxDQUFDO1FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7S0FDaEM7U0FBTSxJQUFJLGFBQWEsSUFBSSx1QkFBdUIsRUFBRTtRQUNu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