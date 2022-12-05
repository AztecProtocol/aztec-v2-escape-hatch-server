#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const ethers_1 = require("ethers");
const units_1 = require("@ethersproject/units");
const UniswapV2Router02_json_1 = __importDefault(require("@uniswap/v2-periphery/build/UniswapV2Router02.json"));
const RollupProcessor_json_1 = __importDefault(require("../artifacts/contracts/RollupProcessor.sol/RollupProcessor.json"));
const IFeeDistributor_json_1 = __importDefault(require("../artifacts/contracts/interfaces/IFeeDistributor.sol/IFeeDistributor.json"));
const deploy_fee_distributor_1 = require("./deploy_fee_distributor");
const deploy_verifier_1 = require("./deploy_verifier");
const add_asset_1 = require("./add_asset/add_asset");
const deploy_uniswap_1 = require("./deploy_uniswap");
const deploy_price_feed_1 = require("./deploy_price_feed");
async function deploy(escapeHatchBlockLower, escapeHatchBlockUpper, signer, initialFee, feeDistributorAddress, uniswapRouterAddress, initialTokenSupply, initialEthSupply) {
    const verifier = await deploy_verifier_1.deployVerifier(signer);
    console.error('Deploying RollupProcessor...');
    const rollupFactory = new ethers_1.ContractFactory(RollupProcessor_json_1.default.abi, RollupProcessor_json_1.default.bytecode, signer);
    // note we need to change this address for production to the multisig
    const ownerAddress = await signer.getAddress();
    const rollup = await rollupFactory.deploy(verifier.address, escapeHatchBlockLower, escapeHatchBlockUpper, ownerAddress);
    console.error(`Awaiting deployment...`);
    await rollup.deployed();
    console.error(`Rollup contract address: ${rollup.address}`);
    const uniswapRouter = uniswapRouterAddress
        ? new ethers_1.Contract(uniswapRouterAddress, UniswapV2Router02_json_1.default.abi, signer)
        : await deploy_uniswap_1.deployUniswap(signer);
    await uniswapRouter.deployed();
    const feeDistributor = feeDistributorAddress
        ? new ethers_1.Contract(feeDistributorAddress, IFeeDistributor_json_1.default.abi, signer)
        : await deploy_fee_distributor_1.deployFeeDistributor(signer, rollup, uniswapRouter);
    rollup.setFeeDistributor(feeDistributor.address);
    if (initialFee) {
        console.error(`Depositing ${initialFee} ETH to FeeDistributor.`);
        const amount = units_1.parseEther(initialFee);
        await feeDistributor.deposit(0, amount, { value: amount });
    }
    const gasPriceFeed = await deploy_price_feed_1.deployPriceFeed(signer, 100000000000n);
    // Add test asset without permit support.
    const asset = await add_asset_1.addAsset(rollup, signer, false);
    const asset2 = await add_asset_1.addAsset(rollup, signer, false);
    await deploy_uniswap_1.createPair(signer, uniswapRouter, asset, initialTokenSupply, initialEthSupply);
    await deploy_uniswap_1.createPair(signer, uniswapRouter, asset2, initialTokenSupply, initialEthSupply);
    const priceFeeds = [
        gasPriceFeed,
        await deploy_price_feed_1.deployPriceFeed(signer),
        await deploy_price_feed_1.deployPriceFeed(signer, 14000000000000000000n),
    ];
    return { rollup, feeDistributor, uniswapRouter, priceFeeds };
}
exports.deploy = deploy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RlcGxveS9kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBLG1DQUEyRDtBQUMzRCxnREFBa0Q7QUFDbEQsZ0hBQXVGO0FBQ3ZGLDJIQUE4RjtBQUM5RixzSUFBd0c7QUFDeEcscUVBQWdFO0FBQ2hFLHVEQUFtRDtBQUNuRCxxREFBaUQ7QUFDakQscURBQTZEO0FBQzdELDJEQUFzRDtBQUUvQyxLQUFLLFVBQVUsTUFBTSxDQUMxQixxQkFBNkIsRUFDN0IscUJBQTZCLEVBQzdCLE1BQWMsRUFDZCxVQUFtQixFQUNuQixxQkFBOEIsRUFDOUIsb0JBQTZCLEVBQzdCLGtCQUEyQixFQUMzQixnQkFBeUI7SUFFekIsTUFBTSxRQUFRLEdBQUcsTUFBTSxnQ0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM5QyxNQUFNLGFBQWEsR0FBRyxJQUFJLHdCQUFlLENBQUMsOEJBQWUsQ0FBQyxHQUFHLEVBQUUsOEJBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFakcscUVBQXFFO0lBQ3JFLE1BQU0sWUFBWSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLE1BQU0sQ0FDdkMsUUFBUSxDQUFDLE9BQU8sRUFDaEIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixZQUFZLENBQ2IsQ0FBQztJQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUU1RCxNQUFNLGFBQWEsR0FBRyxvQkFBb0I7UUFDeEMsQ0FBQyxDQUFDLElBQUksaUJBQVEsQ0FBQyxvQkFBb0IsRUFBRSxnQ0FBcUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxNQUFNLDhCQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFL0IsTUFBTSxjQUFjLEdBQUcscUJBQXFCO1FBQzFDLENBQUMsQ0FBQyxJQUFJLGlCQUFRLENBQUMscUJBQXFCLEVBQUUsOEJBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxNQUFNLDZDQUFvQixDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDOUQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqRCxJQUFJLFVBQVUsRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxVQUFVLHlCQUF5QixDQUFDLENBQUM7UUFDakUsTUFBTSxNQUFNLEdBQUcsa0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQzVEO0lBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxtQ0FBZSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUVsRSx5Q0FBeUM7SUFDekMsTUFBTSxLQUFLLEdBQUcsTUFBTSxvQkFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQkFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckQsTUFBTSwyQkFBVSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDckYsTUFBTSwyQkFBVSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFFdEYsTUFBTSxVQUFVLEdBQUc7UUFDakIsWUFBWTtRQUNaLE1BQU0sbUNBQWUsQ0FBQyxNQUFNLENBQUM7UUFDN0IsTUFBTSxtQ0FBZSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQztLQUNyRCxDQUFDO0lBRUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDO0FBQy9ELENBQUM7QUExREQsd0JBMERDIn0=