# contracts

## WeiBridged

:green_circle: Completed:

-MSG.VALUE to MSG.VALUE bridge logic

-Queue in Solidity pushes new user who locked tokens, then serves them first to be bridged, then removed from queue (Goerli to Optimism path)

-Added 0.3% bridge fee paid to contract Owner

-Able to use Geth and Prysm Goerli synced node locally to read and write to Goerli blockchain

-Tested example queue logic library in contract

:red_circle: In progress:

-Copy queue logic to other Optimism to Goerli

-MSG.VALUE to ERC-20 token address logic (unique on each chain)

-Either use a struct and handle all token addresses in a single main Goerli contract with token addresses and chain IDs, or split Goerli contracts up to keep things simple

-Writing scripts to call contracts between local node / Quicknode / Infura endpoints in either Go, web3.py or web3.js

-Hardhat unit testing mock contracts

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
