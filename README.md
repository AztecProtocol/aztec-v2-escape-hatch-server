# aztecv2-escape-hatch-server
A server that lets the user compute hash paths to exit the Aztec V2 system that has been sunset.


1. Clone the repo
```
git clone https://github.com/AztecProtocol/aztecv2-escape-hatch-server
```
2. Install 

```
cd aztecv2-escape-hatch-server
yarn install
yarn build
```

3. Set your Ethereum RPC Host URL

```
export ETHEREUM_HOST=<YOUR_URL>
```
4. Start the server and use to exit funds from the system.

```
yarn start
```
