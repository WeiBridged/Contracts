# contracts

## WeiBridged

:warning: When you deploy mock contracts, update the contracts to point at each other's addresses with functions like "mockOwnerOptimismBridgeAddress".  :warning:

:green_circle: Completed:

-MSG.VALUE to MSG.VALUE bridge logic

-Queue in Solidity pushes new user who locked tokens, then serves them first to be bridged, then removed from queue (Goerli to Optimism path)

-Added 0.3% bridge fee paid to contract Owner

-Able to use Geth and Prysm Goerli synced node locally to read and write to Goerli blockchain

-Tested example queue logic library in contract

-Hardhat unit test mock :

MSG.VALUE to MSG.VALUE

MSG.VALUE to WRAPPED

## Chainlink Keepers Automated Unlock Mock Contracts:

### Goerli

Register: 

https://keepers.chain.link/goerli/48616257745580902469494598694032950747167863357880398634778718972681967731889

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x8d9db9495aaea27994f71e4af74bfea829d9f97c182f4fd78f60cdac99a12364

### Optimism

https://keepers.chain.link/goerli/48616257745580902469494598694032950747167863357880398634778718972681967731889

Automated Unlock Tx:

https://goerli.etherscan.io/tx/0x39ba9b411fa29c040b933cb476d6047c93a53fd120cd53855852fdde07c4c6a7

:red_circle: In progress:

-Writing scripts to call contracts between local node / Quicknode / Infura endpoints in either Go, web3.py or web3.js

-Deploy contracts to:

Goerli (ETH)

Optimism (ETH),

Aurora (ETH),

Polygon (MATIC),

Oasis (ROSE),

Cronos (TCRO),

Skale (????????),

Shardeum (SHM)

## Bridge design patterns

https://ethereum.org/en/developers/docs/bridges/#how-do-bridges-work

## Hardhat Testing

<img src="https://github.com/WeiBridged/Contracts/blob/main/test/unit/hardhatLog.png" alt="HardhatTest"/>
