"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = void 0;
const ethers_1 = require("ethers");
const address_1 = require("./../../barretenberg.js/address");
const ethers_adapter_1 = require("./ethers_adapter");
const providers_1 = require("@ethersproject/providers");
/**
 * Given an EIP1193 provider, wraps it, and provides the ability to add local accounts.
 */
class WalletProvider {
  constructor(provider) {
    this.provider = provider;
    this.accounts = [];
  }
  static fromHost(ethereumHost) {
    const ethersProvider = new providers_1.JsonRpcProvider(ethereumHost);
    return new WalletProvider(
      new ethers_adapter_1.EthersAdapter(ethersProvider)
    );
  }
  addAccount(privateKey) {
    return this.addEthersWallet(
      new ethers_1.Wallet(
        privateKey,
        new providers_1.Web3Provider(this.provider)
      )
    );
  }
  addEthersWallet(wallet) {
    this.accounts.push(wallet);
    return address_1.EthAddress.fromString(wallet.address);
  }
  getAccounts() {
    return this.accounts.map((a) => address_1.EthAddress.fromString(a.address));
  }
  getAccount(account) {
    return address_1.EthAddress.fromString(this.accounts[account].address);
  }
  getPrivateKey(account) {
    return Buffer.from(this.accounts[account].privateKey.slice(2), "hex");
  }
  getPrivateKeyForAddress(account) {
    const wallet = this.accounts.find((w) =>
      account.equals(address_1.EthAddress.fromString(w.address))
    );
    return wallet ? Buffer.from(wallet.privateKey.slice(2), "hex") : undefined;
  }
  async request(args) {
    switch (args.method) {
      case "eth_accounts":
        return this.accounts.length
          ? this.accounts.map((a) => a.address)
          : await this.provider.request(args);
      case "eth_sign":
        return await this.sign(args);
      case "personal_sign":
        return await this.personalSign(args);
      case "eth_signTypedData_v4":
        return this.signTypedData(args);
      case "eth_signTransaction":
        return this.signTransaction(args);
      case "eth_sendTransaction":
        return this.sendTransaction(args);
      default: {
        return await this.provider.request(args);
      }
    }
  }
  async personalSign(args) {
    const [message, from] = args.params;
    const account = this.accounts.find((a) => a.address.toLowerCase() === from);
    if (account) {
      return await account.signMessage(Buffer.from(message.slice(2), "hex"));
    }
    return await this.provider.request(args);
  }
  async sign(args) {
    const [from, message] = args.params;
    const account = this.accounts.find((a) => a.address.toLowerCase() === from);
    if (account) {
      return await account.signMessage(Buffer.from(message.slice(2), "hex"));
    }
    return await this.provider.request(args);
  }
  async signTypedData(args) {
    const [from, data] = args.params;
    const { types, domain, message } = JSON.parse(data);
    const account = this.accounts.find((a) => a.address.toLowerCase() === from);
    if (account) {
      delete types.EIP712Domain;
      return await account._signTypedData(domain, types, message);
    }
    return this.provider.request(args);
  }
  /**
   * Given a tx in Eth Json Rpc format, convert to ethers format and give to account to sign.
   * Populate any missing fields.
   */
  async signTxLocally(tx, account) {
    const { gas = null, value = 0, from, to, data, nonce = null } = tx;
    const txReq = {
      from,
      to,
      data,
      gasLimit: gas,
      value,
      nonce,
    };
    const toSign = await account.populateTransaction(txReq);
    return await account.signTransaction(toSign);
  }
  async signTransaction(args) {
    const tx = args.params[0];
    const account = this.accounts.find(
      (a) => a.address.toLowerCase() === tx.from.toLowerCase()
    );
    if (account) {
      return this.signTxLocally(tx, account);
    }
    return this.provider.request(args);
  }
  async sendTransaction(args) {
    const tx = args.params[0];
    const account = this.accounts.find(
      (a) => a.address.toLowerCase() === tx.from.toLowerCase()
    );
    if (account) {
      const result = await this.signTxLocally(tx, account);
      return this.provider.request({
        method: "eth_sendRawTransaction",
        params: [result],
      });
    }
    return this.provider.request(args);
  }
  on(notification, listener) {
    return this.provider.on(notification, listener);
  }
  removeListener(notification, listener) {
    return this.provider.removeListener(notification, listener);
  }
}
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0X3Byb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb3ZpZGVyL3dhbGxldF9wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxtQ0FBZ0M7QUFDaEMsa0RBQWtEO0FBQ2xELHFEQUFpRDtBQUNqRCx3REFBNkY7QUFFN0Y7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFHekIsWUFBb0IsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFGdEMsYUFBUSxHQUFhLEVBQUUsQ0FBQztJQUVpQixDQUFDO0lBRTNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBb0I7UUFDekMsTUFBTSxjQUFjLEdBQUcsSUFBSSwyQkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSw4QkFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLFVBQVUsQ0FBQyxVQUFrQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxlQUFNLENBQUMsVUFBVSxFQUFFLElBQUksd0JBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBYztRQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixPQUFPLG9CQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsb0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVNLFVBQVUsQ0FBQyxPQUFlO1FBQy9CLE9BQU8sb0JBQVUs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
