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
