const { expect } = require("chai");
// const { ethers } = require("hardhat");
const { ethers, waffle} = require("hardhat");
const provider = waffle.provider;

describe("MockBridgeMsgERC20 Tests:", function () {

      let WETH;
      let deployedWETH;
      let MockGoerliBridge;
      let MockGoerliBridgeDeployed;
      let MATIC;
      let deployedMATIC;
      let MockOptimismBridge;
      let MockOptimismBridgeDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        WETH = await ethers.getContractFactory("WETH");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        deployedWETH = await WETH.deploy();

        MATIC = await ethers.getContractFactory("MATIC");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        deployedMATIC = await MATIC.deploy();

        MockGoerliBridge = await ethers.getContractFactory("MockGoerliBridgeERC20");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        MockGoerliBridgeDeployed = await MockGoerliBridge.deploy(deployedWETH.address, deployedMATIC.address);

        MockOptimismBridge = await ethers.getContractFactory("MockMumbaiBridge");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        MockOptimismBridgeDeployed = await MockOptimismBridge.deploy(deployedWETH.address, deployedMATIC.address);
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
             expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);
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

           describe("lockTokensForOptimism()", function () {
              it("Revert if MSG.VALUE != 1003", async function () {
                await expect(
                  MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism()
                ).to.be.revertedWith("msgValueNot1003()");
              });
              it("Revert if bridge on other side has no funds.", async function () {
                await expect(
                  MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism({value: "1003"})
                ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");
              });
              it("Allow user to bridge after we set bridge address and send it enough funds.", async function () {
                 const transactionCallAPI = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                 const tx_receiptCallAPI = await transactionCallAPI.wait();
                 expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                 const transactionCallAPI2 = await deployedWETH.transfer(MockOptimismBridgeDeployed.address,"1000")
                 const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                 expect(await deployedWETH.balanceOf(MockOptimismBridgeDeployed.address)).to.equal("1000");

                 const transactionCallAPI3 = await MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism({value: "1003"})
                 const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                 //Revert if we ask to lock funds again if we don't have more funds added.
                 await expect(
                   MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism({value: "1003"})
                 ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");

              });
            });

            describe("lockTokensForGoerli()", function () {
               it("Revert if MSG.VALUE != 1003", async function () {
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli()
                 ).to.be.revertedWith("msgValueNot1003()");
               });
               it("Revert if bridge on other side has no funds.", async function () {
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli({value: "1003"})
                 ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");
               });
               it("Allow user to bridge after we set bridge address and send it enough funds.", async function () {
                 const transactionCallAPI = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                 const tx_receiptCallAPI = await transactionCallAPI.wait();
                 expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                 const transactionCallAPI2 = await deployedMATIC.transfer(MockGoerliBridgeDeployed.address,"1000")
                 const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                 expect(await deployedMATIC.balanceOf(MockGoerliBridgeDeployed.address)).to.equal("1000");

                 const transactionCallAPI3 = await MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli({value: "1003"})
                 const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                 //Revert if we ask to lock funds again if we don't have more funds added.
                 await expect(
                   MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli({value: "1003"})
                 ).to.be.revertedWith("bridgeOnOtherSideNeedsLiqudity()");

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
                  const transactionCallAPI = await deployedMATIC.transfer(MockGoerliBridgeDeployed.address,"1000")
                  const tx_receiptCallAPI = await transactionCallAPI.wait();
                  expect(await deployedMATIC.balanceOf(MockGoerliBridgeDeployed.address)).to.equal("1000");

                  const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                  const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                  expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                  const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                  const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                  expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                  const transactionCallAPI4 = await MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli({value: "1003"})
                  const tx_receiptCallAPI4 = await transactionCallAPI4.wait();

                  await expect(
                    MockGoerliBridgeDeployed.ownerRemoveBridgeLiqudity()
                  ).to.be.revertedWith("queueNotEmpty()");

                });
                it("Valid withdraw", async function () {
                  const transactionCallAPI = await deployedMATIC.transfer(MockGoerliBridgeDeployed.address,"1000")
                  const tx_receiptCallAPI = await transactionCallAPI.wait();
                  expect(await deployedMATIC.balanceOf(MockGoerliBridgeDeployed.address)).to.equal("1000");

                  const transactionCallAPI2 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                  const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                  expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                  const transactionCallAPI3 = await MockGoerliBridgeDeployed.ownerRemoveBridgeLiqudity()
                  const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                  expect(await deployedMATIC.balanceOf(MockGoerliBridgeDeployed.address)).to.equal("0");

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

                   const transactionCallAPI = await deployedWETH.transfer(MockOptimismBridgeDeployed.address,"1000")
                   const tx_receiptCallAPI = await transactionCallAPI.wait();
                   expect(await deployedWETH.balanceOf(MockOptimismBridgeDeployed.address)).to.equal("1000");

                   const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                   const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                   expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                   const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                   const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                   expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                   const transactionCallAPI4 = await MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism({value: "1003"})
                   const tx_receiptCallAPI4 = await transactionCallAPI4.wait();

                   await expect(
                     MockOptimismBridgeDeployed.ownerRemoveBridgeLiqudity()
                   ).to.be.revertedWith("queueNotEmpty()");

                 });
                 it("Valid withdraw", async function () {
                   const transactionCallAPI = await deployedWETH.transfer(MockOptimismBridgeDeployed.address,"1000")
                   const tx_receiptCallAPI = await transactionCallAPI.wait();
                   expect(await deployedWETH.balanceOf(MockOptimismBridgeDeployed.address)).to.equal("1000");

                   const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                   const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                   expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                   const transactionCallAPI3 = await MockOptimismBridgeDeployed.ownerRemoveBridgeLiqudity()
                   const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

                   expect(await deployedWETH.balanceOf(MockOptimismBridgeDeployed.address)).to.equal("0");


                 });


               });

               describe("ownerUnlockGoerliETH()", function () {
                  it("Revert if msg.sender != Owner", async function () {
                    await expect(
                      MockGoerliBridgeDeployed.connect(addr1).ownerUnlockGoerliETH()
                    ).to.be.revertedWith("notOwnerAddress()");
                  });
                  it("Revert if queue is empty", async function () {
                    await expect(
                      MockGoerliBridgeDeployed.ownerUnlockGoerliETH()
                    ).to.be.revertedWith("queueIsEmpty()");
                  });
                  it("Lock Optimism ETH then unlock Goerli ETH.", async function () {
                    const transactionCallAPI = await deployedMATIC.transfer(MockGoerliBridgeDeployed.address,"1000")
                    const tx_receiptCallAPI = await transactionCallAPI.wait();
                    expect(await deployedMATIC.balanceOf(MockGoerliBridgeDeployed.address)).to.equal("1000");

                    const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                    const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                    expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                    const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                    const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                    expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                    const transactionCallAPI4 = await MockOptimismBridgeDeployed.connect(addr1).lockTokensForGoerli({value: "1003"})
                    const tx_receiptCallAPI4 = await transactionCallAPI4.wait();

                    const transactionCallAPI5 = await MockGoerliBridgeDeployed.ownerUnlockGoerliETH()
                    const tx_receiptCallAPI5 = await transactionCallAPI5.wait();
                    expect(await provider.getBalance(MockGoerliBridgeDeployed.address) ).to.equal("0");

                  });

                });

                describe("ownerUnlockOptimismETH()", function () {
                   it("Revert if msg.sender != Owner", async function () {
                     await expect(
                       MockOptimismBridgeDeployed.connect(addr1).ownerUnlockOptimismETH()
                     ).to.be.revertedWith("notOwnerAddress()");
                   });
                   it("Revert if bridge has no ETH", async function () {
                     await expect(
                       MockOptimismBridgeDeployed.ownerUnlockOptimismETH()
                     ).to.be.revertedWith("queueIsEmpty()");
                   });
                   it("Lock Goerli ETH then unlock Optimism ETH.", async function () {
                     const transactionCallAPI = await deployedWETH.transfer(MockOptimismBridgeDeployed.address,"1000")
                     const tx_receiptCallAPI = await transactionCallAPI.wait();
                     expect(await deployedWETH.balanceOf(MockOptimismBridgeDeployed.address)).to.equal("1000");

                     const transactionCallAPI2 = await MockOptimismBridgeDeployed.mockOwnerGoerliBridgeAddress(MockGoerliBridgeDeployed.address);
                     const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
                     expect(await MockOptimismBridgeDeployed.goerliBridgeInstance()).to.equal(MockGoerliBridgeDeployed.address);

                     const transactionCallAPI3 = await MockGoerliBridgeDeployed.mockOwnerOptimismBridgeAddress(MockOptimismBridgeDeployed.address);
                     const tx_receiptCallAPI3 = await transactionCallAPI3.wait();
                     expect(await MockGoerliBridgeDeployed.mumbaiBridgeInstance()).to.equal(MockOptimismBridgeDeployed.address);

                     const transactionCallAPI4 = await MockGoerliBridgeDeployed.connect(addr1).lockTokensForOptimism({value: "1003"})
                     const tx_receiptCallAPI4 = await transactionCallAPI4.wait();

                     const transactionCallAPI5 = await MockOptimismBridgeDeployed.ownerUnlockOptimismETH()
                     const tx_receiptCallAPI5 = await transactionCallAPI5.wait();
                     expect(await provider.getBalance(MockOptimismBridgeDeployed.address) ).to.equal("0");

                   });

                 });

                 describe("dequeue()", function () {
                    it("Revert if msg.sender != address(optimismBridgeInstance)", async function () {
                      await expect(
                        MockGoerliBridgeDeployed.dequeue()
                      ).to.be.revertedWith("notExternalBridge()");
                    });
                  });

                 describe("dequeue()", function () {
                    it("Revert if msg.sender != address(goerliBridgeInstance)", async function () {
                      await expect(
                        MockOptimismBridgeDeployed.dequeue()
                      ).to.be.revertedWith("notExternalBridge()");
                    });
                  });

});
