// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract GoerliBridge {

    mapping(address => uint) public optimismLockedETH;

    error msgValueZero(); //Using custom errors with revert saves gas compared to using require. 

    function lockTokensForOptimism() public payable {
        if (msg.value == 0) { revert msgValueZero(); } 
        optimismLockedETH[msg.sender] += msg.value;
    }

}

contract MockOptimismBridge {

    address public immutable Owner;    

    mapping(address => uint) public optimismBridgedETH;

    error msgValueZero(); //Using custom errors with revert saves gas compared to using require. 
    error notOwnerAddress();
    error bridgedAlready();

    GoerliBridge goerliBridgeInstance;

    constructor(address _token) {
        Owner = msg.sender;
        goerliBridgeInstance = GoerliBridge(_token); //ERC20 token address goes here.
    }

    function addBridgeLiqudity() public payable {
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        if (msg.value == 0) { revert msgValueZero(); } 
    }

    function payoutOptimismETH() public {
        if (goerliBridgeInstance.optimismLockedETH(msg.sender) <= optimismBridgedETH[msg.sender]) { revert bridgedAlready(); } 
        uint sendETH = goerliBridgeInstance.optimismLockedETH(msg.sender)- optimismBridgedETH[msg.sender];
        optimismBridgedETH[msg.sender] += sendETH;
        payable(msg.sender).transfer(sendETH);
    }

}
