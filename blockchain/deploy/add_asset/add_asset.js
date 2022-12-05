#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSupportedAsset = exports.addAsset = void 0;
const ethers_1 = require("ethers");
const ERC20Permit_json_1 = __importDefault(require("../../artifacts/contracts/test/ERC20Permit.sol/ERC20Permit.json"));
const ERC20Mintable_json_1 = __importDefault(require("../../artifacts/contracts/test/ERC20Mintable.sol/ERC20Mintable.json"));
async function addAsset(rollup, signer, supportsPermit) {
    if (supportsPermit) {
        console.error('Deploying ERC20 with permit support...');
        const erc20Factory = new ethers_1.ContractFactory(ERC20Permit_json_1.default.abi, ERC20Permit_json_1.default.bytecode, signer);
        const erc20 = await erc20Factory.deploy();
        console.error(`ERC20 contract address: ${erc20.address}`);
        await setSupportedAsset(rollup, erc20.address, supportsPermit);
        return erc20;
    }
    else {
        console.error('Deploying ERC20...');
        const erc20Factory = new ethers_1.ContractFactory(ERC20Mintable_json_1.default.abi, ERC20Mintable_json_1.default.bytecode, signer);
        const erc20 = await erc20Factory.deploy();
        console.error(`ERC20 contract address: ${erc20.address}`);
        await setSupportedAsset(rollup, erc20.address, supportsPermit);
        return erc20;
    }
}
exports.addAsset = addAsset;
async function setSupportedAsset(rollup, address, supportsPermit) {
    const tx = await rollup.setSupportedAsset(address, supportsPermit);
    const receipt = await tx.wait();
    const assetId = rollup.interface.parseLog(receipt.logs[receipt.logs.length - 1]).args.assetId;
    console.error(`AssetId: ${assetId}`);
}
exports.setSupportedAsset = setSupportedAsset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkX2Fzc2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RlcGxveS9hZGRfYXNzZXQvYWRkX2Fzc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQSxtQ0FBMkQ7QUFDM0QsdUhBQTBGO0FBQzFGLDZIQUFnRztBQUV6RixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWdCLEVBQUUsTUFBYyxFQUFFLGNBQXVCO0lBQ3RGLElBQUksY0FBYyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN4RCxNQUFNLFlBQVksR0FBRyxJQUFJLHdCQUFlLENBQUMsMEJBQVcsQ0FBQyxHQUFHLEVBQUUsMEJBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEYsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDMUQsTUFBTSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMvRCxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU07UUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDcEMsTUFBTSxZQUFZLEdBQUcsSUFBSSx3QkFBZSxDQUFDLDRCQUFhLENBQUMsR0FBRyxFQUFFLDRCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLE1BQU0sWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzFELE1BQU0saUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDL0QsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNILENBQUM7QUFoQkQsNEJBZ0JDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLE1BQWdCLEVBQUUsT0FBZSxFQUFFLGNBQXVCO0lBQ2hHLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNuRSxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUM5RixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBTEQsOENBS0MifQ==