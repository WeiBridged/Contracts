// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract GoerliBridge {

    mapping(address => uint) public optimismLockedETH;

    function lockTokensForOptimism() public payable {
        require(msg.value > 0 ,"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
        optimismLockedETH[msg.sender] += msg.value;
    }

}

contract OptimismBridge {

    address public immutable Owner;    

    mapping(address => uint) public optimismBridgedETH;

    constructor() {
        Owner = msg.sender;
    }

    function addBridgeLiqudity() public payable {
        require(msg.sender == Owner, "ONLY_OWNER_ADDRESS_CAN_USE_THIS_FUNCTION!");
        require(msg.value > 0 ,"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
    }

    function payoutOptimismETH(uint oracleBridgeLockedGoerliETH) public {
        require(msg.sender == Owner, "ONLY_OWNER_ADDRESS_CAN_USE_THIS_FUNCTION!");
        require(oracleBridgeLockedGoerliETH > optimismBridgedETH[msg.sender],"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
        uint sendETH = oracleBridgeLockedGoerliETH- optimismBridgedETH[msg.sender];
        optimismBridgedETH[msg.sender] += sendETH;
        payable(msg.sender).transfer(sendETH);
    }

}
