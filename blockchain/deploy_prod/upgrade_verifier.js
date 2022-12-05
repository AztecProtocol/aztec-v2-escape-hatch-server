#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const experimental_1 = require("@ethersproject/experimental");
const deploy_verifier_1 = require("./deploy_verifier");
const { ETHEREUM_HOST = 'http://localhost:8545', PRIVATE_KEY, ESCAPE_BLOCK_LOWER = '4560', // window of 1hr every 20hrs (escape in last 240 blocks of every 4800)
ESCAPE_BLOCK_UPPER = '4800', } = process.env;
const MULTI_SIG_ADDRESS = '0xE298a76986336686CC3566469e3520d23D1a8aaD';
// https://uniswap.org/docs/v2/smart-contracts/router02/#address
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
function getSigner() {
    if (!PRIVATE_KEY) {
        throw new Error('Specify PRIVATE_KEY.');
    }
    console.error(`Json rpc provider: ${ETHEREUM_HOST}`);
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(ETHEREUM_HOST);
    return new experimental_1.NonceManager(new ethers_1.ethers.Wallet(PRIVATE_KEY, provider));
}
async function main() {
    const verifier = await deploy_verifier_1.deployVerifier(getSigner());
    console.log(`VERIFIER_ADDRESS: ${verifier.address}`);
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV92ZXJpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZXBsb3lfcHJvZC91cGdyYWRlX3ZlcmlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUF3QztBQUN4Qyw4REFBMkQ7QUFDM0QsdURBQW1EO0FBRW5ELE1BQU0sRUFDSixhQUFhLEdBQUcsdUJBQXVCLEVBQ3ZDLFdBQVcsRUFDWCxrQkFBa0IsR0FBRyxNQUFNLEVBQUUsc0VBQXNFO0FBQ25HLGtCQUFrQixHQUFHLE1BQU0sR0FDNUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRWhCLE1BQU0saUJBQWlCLEdBQUcsNENBQTRDLENBQUM7QUFFdkUsZ0VBQWdFO0FBQ2hFLE1BQU0sc0JBQXNCLEdBQUcsNENBQTRDLENBQUM7QUFFNUUsU0FBUyxTQUFTO0lBQ2hCLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3pDO0lBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGVBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sSUFBSSwyQkFBWSxDQUFDLElBQUksZUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFXLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxRQUFRLEdBQUcsTUFBTSxnQ0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUMifQ==