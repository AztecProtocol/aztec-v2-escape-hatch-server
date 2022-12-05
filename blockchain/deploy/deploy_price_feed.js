#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployPriceFeed = void 0;
const ethers_1 = require("ethers");
const MockPriceFeed_json_1 = __importDefault(require("../artifacts/contracts/test/MockPriceFeed.sol/MockPriceFeed.json"));
async function deployPriceFeed(signer, initialPrice = 480000000000000n) {
    console.error('Deploying MockPriceFeed...');
    const priceFeedLibrary = new ethers_1.ContractFactory(MockPriceFeed_json_1.default.abi, MockPriceFeed_json_1.default.bytecode, signer);
    const priceFeed = await priceFeedLibrary.deploy(initialPrice);
    console.error(`MockPriceFeed contract address: ${priceFeed.address}. Initial price: ${initialPrice}.`);
    return priceFeed;
}
exports.deployPriceFeed = deployPriceFeed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95X3ByaWNlX2ZlZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVwbG95L2RlcGxveV9wcmljZV9mZWVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQSxtQ0FBaUQ7QUFDakQsMEhBQTZGO0FBRXRGLEtBQUssVUFBVSxlQUFlLENBQUMsTUFBYyxFQUFFLFlBQVksR0FBRyxnQkFBZ0I7SUFDbkYsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3QkFBZSxDQUFDLDRCQUFhLENBQUMsR0FBRyxFQUFFLDRCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hHLE1BQU0sU0FBUyxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlELE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLFNBQVMsQ0FBQyxPQUFPLG9CQUFvQixZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRXZHLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFQRCwwQ0FPQyJ9