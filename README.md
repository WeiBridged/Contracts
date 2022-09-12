# WeiBridged contracts

## :green_circle: Completed:

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

:red_cirlce: UPDATE WRAPPED CHAINLINK KEEPERS :red_circle:

### Wrapped

#### Goerli MATIC

https://keepers.chain.link/goerli/35090611049909459392773534208222747826595105798904996239807988228673707197528

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0xaf4c9f641b93515bf0ac46d57a55c40533a430dd96401b437cd36e176d8bdb14

#### Mock Mumbai WETH

https://keepers.chain.link/goerli/15805420323940780469410680538856219599627703238119380930616723455732843521194

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0xf4a389c0624e029cac3f91d303553dc823238d72a8d49a67f154df0942c643de

## :warning: Ideally we use CCIP and Chainlink Keepers, but CCIP is still in development as of writing. :warning:

## WeiBridged 

Goerli to Optimism

https://goerli.etherscan.io/address/0xd00fcf4b79d6911f54989280b132aad21b0d2438

Optimism to Goerli

https://blockscout.com/optimism/goerli/address/0x82Fa8539F40F7317CEd662130d1F98eE1DE687a2/transactions#address-tabs

## :red_circle: In progress:

-Writing scripts to call contracts between local node / Quicknode / Infura endpoints in either Go, web3.py or web3.js

-Deploy contracts to:

Aurora (ETH),

Polygon (MATIC),

Oasis (ROSE),

Cronos (TCRO),

Skale (????????),

Shardeum (SHM)

## Bridge design patterns

https://ethereum.org/en/developers/docs/bridges/#how-do-bridges-work

## Hardhat Testing

:warning: When you deploy mock contracts, update the contracts to point at each other's addresses with functions like "mockOwnerOptimismBridgeAddress".  :warning:

<img src="https://github.com/WeiBridged/Contracts/blob/main/test/unit/hardhatLog.png" alt="HardhatTest"/>
