# WeiBridged contracts

-MSG.VALUE to MSG.VALUE bridge logic

-Queue in Solidity pushes new user who locked tokens, then serves them first to be bridged, then removed from queue (Goerli to Optimism path)

-Added 0.3% bridge fee paid to contract Owner

-Able to use Geth and Prysm Goerli synced node locally to read and write to Goerli blockchain

-Tested example queue logic library in contract

-Hardhat unit test mock :

MSG.VALUE to MSG.VALUE

MSG.VALUE to WRAPPED

## Chainlink Keepers Automated Unlock Mock Contracts on Goerli:

### MSG.VALUE

#### Goerli

https://keepers.chain.link/goerli/109431267378997881710933877235655656265820581519043501350440192241368993617095

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x761d4962c119b335fc82c2206faa59f84c3f97df0796f7bb1da00f40401cd9f5

#### Mock Optimism

https://keepers.chain.link/goerli/72481870100616413524543533122208944145202375451493878672180918931194008905864

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x549282792805cc202bb1fe02fbe927f25895ef93e134ef24bd87009157d780d5

### Wrapped

#### Goerli MATIC

https://keepers.chain.link/goerli/44672928778541736436187787576552467984358095279622653917887023890049197297829

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x952bb7909626b4417151475492bd393605ed5b67cbb33312c3867bd109a4215a

#### Mock Mumbai WETH

https://keepers.chain.link/goerli/51328062644048824879005793848957573415939904013643902837116609648852103753257

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x9f85aa14eae532d1a7952b7eb0d5bf8acd50b12e314d9725f58ff864e507ad0b

## :warning: Ideally we use CCIP and Chainlink Keepers, but CCIP is still in development as of writing. :warning:

## WeiBridged 

Optimism Goerli and Ethereum Goerli

https://blockscout.com/optimism/goerli/address/0xf5f1e4510B7c1645491285eBb9F762E371884B45
https://goerli.etherscan.io/address/0xaED1aC1429EAB4569e218b2aD1A585146fCdE061

Polygon Mumbai and Ethereum Goerli

https://mumbai.polygonscan.com/address/0xb7307ddd7c370a309db38243258318cbb5e1860c
https://goerli.etherscan.io/address/0xe33EE68Fc5477Ea95F4897b67d3E763b7F74FC52

⚠️ We did not write the Golang communication for the chains below and we assume MSG.VALUE == MSG.VALUE. Cotract logic should be the same with MSG.VALUE == MSG.VALUE. If we had more time during the ETHOnline 2022 hackathon we would write out all logic for each RPC chain. ⚠️

Aurora Testnet and Ethereum Goerli

[pending 1] https://testnet.aurorascan.dev/tx/0xf18c3d0a986fd87a9ca2ccc2558d7f09d5cb517dcb7b6d7a3d92089cf600e0ab

[pending 2] https://testnet.aurorascan.dev/tx/0x79e06d16d98ff3408fa79249d6e6f9f816b82c4cfbe907e036474fdbbba0e543

https://goerli.etherscan.io/address/0x84959b9c82fa26fe95ba5c7ebe21a409b501a742

Oasis emerald Testnet and Ethereum Goerli

https://testnet.explorer.emerald.oasis.dev/address/0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268/transactions
https://goerli.etherscan.io/address/0xde89f4557a7a224cb7d7d361477ca8e96b3b0be7

Cronos Testnet(TCRO)

https://cronos.org/explorer/testnet3/address/0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268
https://goerli.etherscan.io/address/0x834665566fbc3a9127c939bea8230fcd44ede4db

Shardeum Liberty 2.0 and Ethereum Goerli [some contracts need EIP-2930 accessList address and storage data to work on other shards!]

https://explorer.liberty20.shardeum.org/account/0x9e5fb5182000b8b21b16d62fc2d04148613ca7b1?page=1
https://goerli.etherscan.io/tx/0x85c213f0f417e7b3a387300706d8404f15e81e934ae89871f2cd54805f86b66d

🔴

Skale (????????),

🔴

## 📷 Presentation Slides: 

https://docs.google.com/presentation/d/1HV73K2lnuzfmi5FZIEtFoYzBK6tn95W-jIeFuBpkRb0/edit?usp=sharing


## Hardhat Testing

:warning: When you deploy mock contracts, update the contracts to point at each other's addresses with functions like "mockOwnerOptimismBridgeAddress".  :warning:

<img src="https://github.com/WeiBridged/Contracts/blob/main/test/unit/hardhatLog.png" alt="HardhatTest"/>

## Bridge design patterns research

https://ethereum.org/en/developers/docs/bridges/#how-do-bridges-work
