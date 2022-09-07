// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract goerliBridge {

    mapping(address => uint) public optimismLockedETH;

    function lockTokensForOptimism() public payable {
        require(msg.value > 0 ,"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
        optimismLockedETH[msg.sender] += msg.value;
    }

}

contract MockOptimismBridge {

    address public immutable Owner;    

    mapping(address => uint) public optimismBridgedETH;

    goerliBridge goerliBridgeInstance;

    constructor(address _token) {
        Owner = msg.sender;
        goerliBridgeInstance = goerliBridge(_token); //ERC20 token address goes here.
    }

    function addBridgeLiqudity() public payable {
        require(msg.sender == Owner, "ONLY_OWNER_ADDRESS_CAN_USE_THIS_FUNCTION!");
        require(msg.value > 0 ,"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
    }

    function payoutOptimismETH() public {
        require(goerliBridgeInstance.optimismLockedETH(msg.sender)  > optimismBridgedETH[msg.sender],"MSG.VALUE_MUST_BE_GREATER_THAN_0.");
        uint sendETH = goerliBridgeInstance.optimismLockedETH(msg.sender)- optimismBridgedETH[msg.sender];
        optimismBridgedETH[msg.sender] += sendETH;
        payable(msg.sender).transfer(sendETH);
    }

}
