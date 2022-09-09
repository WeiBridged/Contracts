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
    error bridgeOnOtherSideNeedsLiqudity();
    error bridgeEmpty();
    error ownerBridgeUsersBeforeWithdraw();

    constructor() {
        Owner = msg.sender;
    }

    MockOptimismBridge public optimismBridgeInstance;    

    function lockTokensForOptimism(uint bridgeAmount) public payable {
        if (bridgeAmount < 1000) { revert msgValueLessThan1000(); } 
        if (msg.value != (1003*bridgeAmount)/1000 ) { revert msgValueDoesNotCoverFee(); } 
        // if (address(optimismBridgeInstance).balance < bridgeAmount) { revert bridgeOnOtherSideNeedsLiqudity(); } 
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

    function ownerRemoveBridgeLiqudity() public  {
        if (address(this).balance == 0) { revert bridgeEmpty(); } 
        // if (false) { revert ownerBridgeUsersBeforeWithdraw(); } 
        payable(Owner).transfer(address(this).balance);
    }

    function mockOwnerOptimismBridgeAddress(address _token) public{
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        optimismBridgeInstance = MockOptimismBridge(_token); 
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
    error bridgeEmpty();

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

    function ownerRemoveBridgeLiqudity() public  {
        if (address(this).balance == 0) { revert bridgeEmpty(); } 
        payable(Owner).transfer(address(this).balance);
    }

    function mockOwnerOptimismBridgeAddress(address _token) public{
        if (msg.sender != Owner) { revert notOwnerAddress(); } 
        goerliBridgeInstance = GoerliBridge(_token); 
    }

}

contract Queue { //Modified from //https://programtheblockchain.com/posts/2018/03/23/storage-patterns-stacks-queues-and-deques/
    mapping(uint256 => address) public queue; 

    uint256 public last; //Do not declare 0 directly, will waste gas.
    uint256 public first = 1; 

    error queueIsEmpty();

    function enqueue(address Address) public {
        last += 1;
        queue[last] = Address;
    }

    function dequeue() public { //Removed return value, not needed.
        if (last < first) { revert queueIsEmpty(); } //Removed require for this since it costs less gas. 
        delete queue[first];
        first += 1;
    }
}
