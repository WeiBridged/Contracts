// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract GoerliBridge {

    address public immutable Owner;    

    mapping(address => uint) public lockedForOptimismETH;
    mapping(address => uint) public goerliBridgedETH;

    error msgValueZero(); //Using custom errors with revert saves gas compared to using require. 
    error msgValueLessThan1000(); 
    error msgValueDoesNotCoverFee(); 
    error notOwnerAddress();
    error bridgedAlready();

    constructor() {
        Owner = msg.sender;
    }

    MockOptimismBridge public optimismBridgeInstance;    

    function lockTokensForOptimism(uint bridgeAmount) public payable {
        if (bridgeAmount < 1000) { revert msgValueLessThan1000(); } 
        if (msg.value != (1003*bridgeAmount)/1000 ) { revert msgValueDoesNotCoverFee(); } 
        lockedForOptimismETH[msg.sender] += (1000*msg.value)/1003;
        payable(Owner).transfer(msg.value);
    }

    function unlockedOptimismETH() public {
        if (optimismBridgeInstance.lockedForGoerliETH(msg.sender) <= goerliBridgedETH[msg.sender]) { revert bridgedAlready(); } 
        uint sendETH = optimismBridgeInstance.lockedForGoerliETH(msg.sender)- goerliBridgedETH[msg.sender];
        goerliBridgedETH[msg.sender] += sendETH;
        payable(msg.sender).transfer(sendETH);
    }

    function ownerAddBridgeLiqudity() public payable {
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        if (msg.value == 0) { revert msgValueZero(); } 
    }

    function mockOwnerOptimismBridgeAddress(address _token) public{
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        optimismBridgeInstance = MockOptimismBridge(_token); //ERC20 token address goes here.;
    }

}

contract MockOptimismBridge {

    address public immutable Owner;    

    mapping(address => uint) public lockedForGoerliETH;
    mapping(address => uint) public optimismBridgedETH;
    
    error msgValueZero(); //Using custom errors with revert saves gas compared to using require. 
    error msgValueLessThan1000(); 
    error msgValueDoesNotCoverFee(); 
    error notOwnerAddress();
    error bridgedAlready();

    GoerliBridge public goerliBridgeInstance;

    constructor() {
        Owner = msg.sender;
    }

    function lockTokensForGoerli(uint bridgeAmount) public payable {
        if (bridgeAmount < 1000) { revert msgValueLessThan1000(); } 
        if (msg.value != (1003*bridgeAmount)/1000 ) { revert msgValueDoesNotCoverFee(); } 
        lockedForGoerliETH[msg.sender] += (1000*msg.value)/1003;
        payable(Owner).transfer(msg.value);
    }

    function unlockedOptimismETH() public {
        if (goerliBridgeInstance.lockedForOptimismETH(msg.sender) <= optimismBridgedETH[msg.sender]) { revert bridgedAlready(); } 
        uint sendETH = goerliBridgeInstance.lockedForOptimismETH(msg.sender)- optimismBridgedETH[msg.sender];
        optimismBridgedETH[msg.sender] += sendETH;
        payable(msg.sender).transfer(sendETH);
    }

    function ownerAddBridgeLiqudity() public payable {
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        if (msg.value == 0) { revert msgValueZero(); } 
    }

    function mockOwnerOptimismBridgeAddress(address _token) public{
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        goerliBridgeInstance = GoerliBridge(_token); //ERC20 token address goes here.;
    }

}
