const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet Tests:", function () {

      let MockGoerliBridge;
      let MockGoerliBridgeDeployed;
      let MockOptimismBridge;
      let MockOptimismBridgeDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        MockGoerliBridge = await ethers.getContractFactory("MockGoerliBridge");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        MockGoerliBridgeDeployed = await MockGoerliBridge.deploy();
        MockOptimismBridge = await ethers.getContractFactory("MockOptimismBridge");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        MockOptimismBridgeDeployed = await MockOptimismBridge.deploy();
      });

      describe("constructor()", function () {
          it("relayAddress set", async function () {
            expect(await MockGoerliBridgeDeployed.Owner()).to.equal(owner.address);
          });
          it("relayAddress set", async function () {
            expect(await MockOptimismBridgeDeployed.Owner()).to.equal(owner.address);
          });
       });

       describe("mockOwnerOptimismBridgeAddress(address _token)", function () {
          it("Revert if msg.sender != Owner", async function () {
            await expect(
              MockGoerliBridgeDeployed.connect(addr1).mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address)
            ).to.be.revertedWith("notOwnerAddress()");
          });
          it("If msg.sender == Owner, update bridge address", async function () {
             const transactionCallAPI = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
             const tx_receiptCallAPI = await transactionCallAPI.wait();
             expect(await MockGoerliBridgeDeployed.optimismBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);
          });

        });

        describe("mockOwnerGoerliBridgeAddress(address _token)", function () {
           it("Revert if relayAddress is not msg.sender", async function () {
             await expect(
               MockOptimismBridgeDeployed.connect(addr1).mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address)
             ).to.be.revertedWith("notOwnerAddress()");
           });
           it("If msg.sender == Owner, update bridge address", async function () {
             const transactionCallAPI = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
             const tx_receiptCallAPI = await transactionCallAPI.wait();
             expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);
           });

         });

       // describe("withdrawDirect()", function () {
       //     it("Revert if no LINK in faucet", async function () {
       //       await expect(
       //         ContractDeployed.withdrawDirect()
       //       ).to.be.revertedWith("Faucet does not have any more LINK (has less than 20 LINK currently).");
       //     });
       //     it("User gets 20 LINK, then gets reverted if asks again if 12 hours have not passed.", async function () {
       //
       //       const transactionCallAPI = await ERC20Deployed.transfer(ContractDeployed.address, "40000000000000000000");
       //       const tx_receiptCallAPI = await transactionCallAPI.wait();
       //       expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("40000000000000000000");
       //
       //       const transactionCallAPI2 = await ContractDeployed.connect(addr1).withdrawDirect();
       //       const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
       //       expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("20000000000000000000");
       //       expect(await ERC20Deployed.balanceOf(addr1.address)).to.equal("20000000000000000000");
       //
       //       await expect(
       //         ContractDeployed.connect(addr1).withdrawDirect()
       //       ).to.be.revertedWith("Current user must wait 12 hours for faucet cooldown.");
       //
       //     });
       //
       //  });
       //
       //  describe("withdrawRelay(relayCaller)", function () {
       //      it("Revert if relayAddress is not msg.sender", async function () {
       //        await expect(
       //          ContractDeployed.connect(addr1).withdrawRelay(addr1.address)
       //        ).to.be.revertedWith("Only the relay address can access this function.");
       //      });
       //      it("Revert if no LINK in faucet", async function () {
       //        await expect(
       //          ContractDeployed.withdrawRelay(addr1.address)
       //        ).to.be.revertedWith("Faucet does not have any more LINK (has less than 20 LINK currently).");
       //      });
       //      it("User gets 20 LINK, then gets reverted if asks again if 12 hours have not passed.", async function () {
       //
       //        const transactionCallAPI = await ERC20Deployed.transfer(ContractDeployed.address, "40000000000000000000");
       //        const tx_receiptCallAPI = await transactionCallAPI.wait();
       //        expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("40000000000000000000");
       //
       //        const transactionCallAPI2 = await ContractDeployed.withdrawRelay(addr1.address);
       //        const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
       //        expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("20000000000000000000");
       //        expect(await ERC20Deployed.balanceOf(addr1.address)).to.equal("20000000000000000000");
       //
       //        await expect(
       //          ContractDeployed.withdrawRelay(addr1.address)
       //        ).to.be.revertedWith("Current user must wait 12 hours for faucet cooldown.");
       //
       //      });
       //
       //   });

});
