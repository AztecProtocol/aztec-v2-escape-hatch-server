"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Signer = void 0;
const ethers_1 = require("ethers");
const validate_signature_1 = require("../validate_signature");
class Web3Signer {
    constructor(provider) {
        this.provider = provider;
    }
    async signPersonalMessage(message, address) {
        const toSign = ethers_1.utils.hexlify(ethers_1.utils.toUtf8Bytes(message.toString()));
        const result = await this.provider.send('personal_sign', [toSign, address.toString()]);
        return Buffer.from(result.slice(2), 'hex');
    }
    async signMessage(message, address) {
        const signer = this.provider.getSigner(address.toString());
        const sig = await signer.signMessage(message);
        const signature = Buffer.from(sig.slice(2), 'hex');
        // Ganache is not signature standard compliant. Returns 00 or 01 as v.
        // Need to adjust to make v 27 or 28.
        const v = signature[signature.length - 1];
        if (v <= 1) {
            return Buffer.concat([signature.slice(0, -1), Buffer.from([v + 27])]);
        }
        return signature;
    }
    async signTypedData({ domain, types, message }, address) {
        const signer = this.provider.getSigner(address.toString());
        const result = await signer._signTypedData(domain, types, message);
        const signature = Buffer.from(result.slice(2), 'hex');
        const r = signature.slice(0, 32);
        const s = signature.slice(32, 64);
        const v = signature.slice(64, 65);
        const sig = { v, r, s };
        return sig;
    }
    validateSignature(publicOwner, signature, signingData) {
        return validate_signature_1.validateSignature(publicOwner, signature, signingData);
    }
}
exports.Web3Signer = Web3Signer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19zaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2lnbmVyL3dlYjNfc2lnbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLG1DQUErQjtBQUMvQiw4REFBMEQ7QUFFMUQsTUFBYSxVQUFVO0lBQ3JCLFlBQW9CLFFBQXNCO1FBQXRCLGFBQVEsR0FBUixRQUFRLENBQWM7SUFBRyxDQUFDO0lBRXZDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxPQUFlLEVBQUUsT0FBbUI7UUFDbkUsTUFBTSxNQUFNLEdBQUcsY0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFlLEVBQUUsT0FBbUI7UUFDM0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDM0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRCxzRUFBc0U7UUFDdEUscUNBQXFDO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQWEsRUFBRSxPQUFtQjtRQUNuRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQXNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMzQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxXQUF1QixFQUFFLFNBQWlCLEVBQUUsV0FBbUI7UUFDdEYsT0FBTyxzQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDRjtBQXRDRCxnQ0FzQ0MifQ==