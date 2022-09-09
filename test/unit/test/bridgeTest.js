const { expect } = require("chai");
// const { ethers } = require("hardhat");
const { ethers, waffle} = require("hardhat");
const provider = waffle.provider;

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
          it("Owner set", async function () {
            expect(await MockGoerliBridgeDeployed.Owner()).to.equal(owner.address);
          });
       });

       describe("constructor()", function () {
           it("Owner set", async function () {
             expect(await MockOptimismBridgeDeployed.Owner()).to.equal(owner.address);
           });
        });


       describe("mockOwnerOptimismBridgeAddress(address)", function () {
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

        describe("mockOwnerGoerliBridgeAddress(address)", function () {
           it("Revert if Owner is not msg.sender", async function () {
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

         describe("ownerAddBridgeLiqudity()", function () {
            it("Revert if Owner is not msg.sender", async function () {
              await expect(
                MockGoerliBridgeDeployed.connect(addr1).ownerAddBridgeLiqudity()
              ).to.be.revertedWith("notOwnerAddress()");
            });
            it("Revert if MSG.VALUE == 0", async function () {
              await expect(
                MockGoerliBridgeDeployed.ownerAddBridgeLiqudity()
              ).to.be.revertedWith("msgValueZero()");
            });
            it("Otherwise send MSG.VALUE to contract", async function () {
               const transaction = await MockGoerliBridgeDeployed
                .ownerAddBridgeLiqudity({
                  value: "1000",
                });
              const tx_receipt = await transaction.wait();
              expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("1000");
            });

          });

          describe("ownerAddBridgeLiqudity()", function () {
             it("Revert if Owner is not msg.sender", async function () {
               await expect(
                 MockOptimismBridgeDeployed.connect(addr1).ownerAddBridgeLiqudity()
               ).to.be.revertedWith("notOwnerAddress()");
             });
             it("Revert if MSG.VALUE == 0", async function () {
               await expect(
                 MockOptimismBridgeDeployed.ownerAddBridgeLiqudity()
               ).to.be.revertedWith("msgValueZero()");
             });
             it("Otherwise send MSG.VALUE to contract", async function () {
                const transaction = await MockOptimismBridgeDeployed
                 .ownerAddBridgeLiqudity({
                   value: "1000",
                 });
               const tx_receipt = await transaction.wait();
               expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("1000");
             });

           });

           describe("ownerUnlockOptimismETH(bridgeAmount)", function () {
              it("Revert if MSG.VALUE < 1000", async function () {
                await expect(
                  MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism(0)
                ).to.be.revertedWith("msgValueLessThan1000()");
              });
              it("Revert if MSG.VALUE != (1003*bridgeAmount)/1000", async function () {
                await expect(
                  MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism(1000)
                ).to.be.revertedWith("msgValueDoesNotCoverFee()");
              });
              it("Revert if bridge on other side has no funds.", async function () {
                await expect(
                  MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism(1000, {value: "1003"})
                ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");
              });
              it("Allow user to bridge after we set bridge address and send it enough funds.", async function () {
                const transactionCallAPI = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                const tx_receiptCallAPI = await transactionCallAPI.wait();
                expect(await MockGoerliBridgeDeployed.optimismBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                const transactionCallAPI2 = await MockOptimismBridgeDeployed
                 .ownerAddBridgeLiqudity({
                   value: "1000",
                 });
               const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
               expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("1000");

               const transactionCallAPI3 = await MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism("1000", {value: "1003"})
               const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

              });
            });

            describe("lockTokensForGoerli(bridgeAmount)", function () {
               it("Revert if MSG.VALUE < 1000", async function () {
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli(0)
                 ).to.be.revertedWith("msgValueLessThan1000()");
               });
               it("Revert if MSG.VALUE != (1003*bridgeAmount)/1000", async function () {
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli(1000)
                 ).to.be.revertedWith("msgValueDoesNotCoverFee()");
               });
               it("Revert if bridge on other side has no funds.", async function () {
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli(1000, {value: "1003"})
                 ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");
               });
               it("Allow user to bridge after we set bridge address and send it enough funds.", async function () {
                 const transactionCallAPI = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                 const tx_receiptCallAPI = await transactionCallAPI.wait();
                 expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                 const transactionCallAPI2 = await MockGoerliBridgeDeployed
                  .ownerAddBridgeLiqudity({
                    value: "1000",
                  });
                const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("1000");

                const transactionCallAPI3 = await MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli("1000", {value: "1003"})
                const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

               });
             });

             describe("ownerRemoveBridgeLiqudity()", function () {
                it("Revert if msg.sender != Owner", async function () {
                  await expect(
                    MockGoerliBridgeDeployed.connect(addr1).ownerRemoveBridgeLiqudity()
                  ).to.be.revertedWith("notOwnerAddress()");
                });
                it("Revert if bridge has no ETH", async function () {
                  await expect(
                    MockGoerliBridgeDeployed.ownerRemoveBridgeLiqudity()
                  ).to.be.revertedWith("bridgeEmpty()");
                });
                it("Cannot withdraw if user on other contract queue, need to bridge them first.", async function () {
                  const transactionCallAPI = await MockGoerliBridgeDeployed
                    .ownerAddBridgeLiqudity({
                      value: "1000",
                    });

                  const tx_receiptCallAPI = await transactionCallAPI.wait();
                  expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("1000");

                  const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                  const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                  expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                  const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                  const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                  expect(await MockGoerliBridgeDeployed.optimismBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                  const transactionCallAPI4 = await MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli("1000", {value: "1003"})
                  const tx_receiptCallAPI4 = await transactionCallAPI3.wait();

                  await expect(
                    MockGoerliBridgeDeployed.ownerRemoveBridgeLiqudity()
                  ).to.be.revertedWith("queueNotEmpty()");

                });
                it("Valid withdraw", async function () {
                  const transactionCallAPI = await MockGoerliBridgeDeployed
                    .ownerAddBridgeLiqudity({
                      value: "1000",
                    });

                  const tx_receiptCallAPI = await transactionCallAPI.wait();
                  expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("1000");

                  const transactionCallAPI2 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                  const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                  expect(await MockGoerliBridgeDeployed.optimismBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                  const transactionCallAPI3 = await MockGoerliBridgeDeployed.ownerRemoveBridgeLiqudity()
                  const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                  expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("0");

                });

              });

              describe("ownerRemoveBridgeLiqudity()", function () {
                 it("Revert if msg.sender != Owner", async function () {
                   await expect(
                     MockOptimismBridgeDeployed.connect(addr1).ownerRemoveBridgeLiqudity()
                   ).to.be.revertedWith("notOwnerAddress()");
                 });
                 it("Revert if bridge has no ETH", async function () {
                   await expect(
                     MockOptimismBridgeDeployed.ownerRemoveBridgeLiqudity()
                   ).to.be.revertedWith("bridgeEmpty()");
                 });
                 it("Cannot withdraw if user on other contract queue, need to bridge them first.", async function () {
                   const transactionCallAPI = await MockOptimismBridgeDeployed
                     .ownerAddBridgeLiqudity({
                       value: "1000",
                     });

                   const tx_receiptCallAPI = await transactionCallAPI.wait();
                   expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("1000");

                   const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                   const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                   expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                   const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                   const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                   expect(await MockGoerliBridgeDeployed.optimismBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                   const transactionCallAPI4 = await MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism("1000", {value: "1003"})
                   const tx_receiptCallAPI4 = await transactionCallAPI3.wait();

                   await expect(
                     MockOptimismBridgeDeployed.ownerRemoveBridgeLiqudity()
                   ).to.be.revertedWith("queueNotEmpty()");

                 });
                 it("Valid withdraw", async function () {
                   const transactionCallAPI = await MockOptimismBridgeDeployed
                     .ownerAddBridgeLiqudity({
                       value: "1000",
                     });

                   const tx_receiptCallAPI = await transactionCallAPI.wait();
                   expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("1000");

                   const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                   const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                   expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                   const transactionCallAPI3 = await MockOptimismBridgeDeployed.ownerRemoveBridgeLiqudity()
                   const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                   expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("0");

                 });


               });

});
