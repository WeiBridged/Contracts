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

contract OptimismBridge {

    address public immutable Owner;    

    mapping(address => uint) public optimismBridgedETH;

    error msgValueZero(); //Using custom errors with revert saves gas compared to using require. 
    error notOwnerAddress();
    error bridgedAlready();

    constructor() {
        Owner = msg.sender;
    }

    function addBridgeLiqudity() public payable {
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        if (msg.value == 0) { revert msgValueZero(); } 
    }

    function payoutOptimismETH(address bridgeUser, uint oracleBridgeLockedGoerliETH) public {
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        if (oracleBridgeLockedGoerliETH <= optimismBridgedETH[bridgeUser]) { revert bridgedAlready(); } 
        uint sendETH = oracleBridgeLockedGoerliETH - optimismBridgedETH[bridgeUser];
        optimismBridgedETH[bridgeUser] += sendETH;
        payable(bridgeUser).transfer(sendETH);
    }

}
