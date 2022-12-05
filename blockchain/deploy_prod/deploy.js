"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const ethers_1 = require("ethers");
const RollupProcessor_json_1 = __importDefault(require("../artifacts/contracts/RollupProcessor.sol/RollupProcessor.json"));
const deploy_fee_distributor_1 = require("./fee_distributor/deploy_fee_distributor");
const deploy_verifier_1 = require("./deploy_verifier");
async function deploy(escapeHatchBlockLower, escapeHatchBlockUpper, uniswapRouterAddress, multiSigAddr, signer) {
    const verifier = await deploy_verifier_1.deployVerifier(signer);
    console.error('Deploying RollupProcessor...');
    const rollupFactory = new ethers_1.ContractFactory(RollupProcessor_json_1.default.abi, RollupProcessor_json_1.default.bytecode, signer);
    const ownerAddress = await signer.getAddress();
    const rollup = await rollupFactory.deploy(verifier.address, escapeHatchBlockLower, escapeHatchBlockUpper, ownerAddress);
    console.error(`Awaiting deployment...`);
    await rollup.deployed();
    console.error(`Rollup contract address: ${rollup.address}`);
    const feeDistributor = await deploy_fee_distributor_1.deployFeeDistributor(signer, rollup.address, uniswapRouterAddress);
    rollup.setFeeDistributor(feeDistributor.address);
    const response = await rollup.transferOwnership(multiSigAddr);
    const receipt = await response.wait();
    if (!receipt.status) {
        throw new Error('Deployment failed.');
    }
    return { rollup, feeDistributor };
}
exports.deploy = deploy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RlcGxveV9wcm9kL2RlcGxveS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBaUQ7QUFFakQsMkhBQThGO0FBQzlGLHFGQUFnRjtBQUNoRix1REFBbUQ7QUFFNUMsS0FBSyxVQUFVLE1BQU0sQ0FDMUIscUJBQTZCLEVBQzdCLHFCQUE2QixFQUM3QixvQkFBNEIsRUFDNUIsWUFBb0IsRUFDcEIsTUFBYztJQUVkLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0NBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDOUMsTUFBTSxhQUFhLEdBQUcsSUFBSSx3QkFBZSxDQUFDLDhCQUFlLENBQUMsR0FBRyxFQUFFLDhCQUFlLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRWpHLE1BQU0sWUFBWSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLE1BQU0sQ0FDdkMsUUFBUSxDQUFDLE9BQU8sRUFDaEIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixZQUFZLENBQ2IsQ0FBQztJQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUU1RCxNQUFNLGNBQWMsR0FBRyxNQUFNLDZDQUFvQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDaEcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkYsTUFBTSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBbENELHdCQWtDQyJ9