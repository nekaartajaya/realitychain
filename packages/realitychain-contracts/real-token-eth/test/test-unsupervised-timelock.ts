export {};

const { expect } = require("chai");
const { id } = require("ethers/lib/utils");
const { hashMessage } = require("ethers/lib/utils");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers")

async function withdraw(realTimelock: any, signer: any) {
  var tx = await realTimelock.connect(signer).withdraw();
  var receipt = await tx.wait();
}

describe("UnsupervisedTimelock", function () {
  it("Testing scenario for contract 'UnsupervisedTimelock'", async function () {
    // /**
    //  * Initialize contract 'RealToken' and contract 'UnsupervisedTimelock'
    //  */
    // const decimals = BigNumber.from('1000000000000000000');

    // const [owner, account1, account2] = await ethers.getSigners();
    // const ownerAddress = await owner.getAddress();
    // const address1 = await account1.getAddress();
    // const address2 = await account2.getAddress();

    // const RealToken = await ethers.getContractFactory("RealToken");
    // const real = await RealToken.deploy();
    // await real.deployed();

    // const RealTimelock = await ethers.getContractFactory("UnsupervisedTimelock");
    // const realTimelock = await RealTimelock.deploy(real.address, address1, Math.floor(Date.now() / 1000), 5, BigNumber.from('500000').mul(decimals));
    // await realTimelock.deployed();


    // expect(await real.totalSupply()).to.equal(BigNumber.from('100000000').mul(decimals));
    // expect(await realTimelock.token()).to.equal(real.address);

    // expect(await real.balanceOf(ownerAddress)).to.equal(BigNumber.from('100000000').mul(decimals));

    // var tx = await real.transfer(realTimelock.address, BigNumber.from('500000').mul(decimals));
    // await tx.wait();
    // expect(await real.balanceOf(realTimelock.address)).to.equal(BigNumber.from('500000').mul(decimals));

    // expect(await realTimelock.unreleasedBalance()).to.equal(BigNumber.from('500000').mul(decimals));
    // expect(await realTimelock.releasedBalance()).to.equal(0);
    // expect(await realTimelock.withdrawedBalance()).to.equal(0);

    // await hre.network.provider.send("evm_increaseTime", [86400]);
    // await hre.network.provider.send("evm_mine");

    // expect(await realTimelock.unreleasedBalance()).to.equal(BigNumber.from('400000').mul(decimals));
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('100000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(0);

    // await withdraw(realTimelock, account2);

    // expect(await real.balanceOf(address2)).to.equal(0);
    // expect(await real.balanceOf(address1)).to.equal(BigNumber.from('100000').mul(decimals));
    // expect(await realTimelock.unreleasedBalance()).to.equal(BigNumber.from('400000').mul(decimals));
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('100000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(BigNumber.from('100000').mul(decimals));

    // await hre.network.provider.send("evm_increaseTime", [86400 * 2]);
    // await hre.network.provider.send("evm_mine");

    // expect(await realTimelock.unreleasedBalance()).to.equal(BigNumber.from('200000').mul(decimals));
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('300000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(BigNumber.from('100000').mul(decimals));

    // await withdraw(realTimelock, account2);

    // expect(await real.balanceOf(address2)).to.equal(0);
    // expect(await real.balanceOf(address1)).to.equal(BigNumber.from('300000').mul(decimals));
    // expect(await realTimelock.unreleasedBalance()).to.equal(BigNumber.from('200000').mul(decimals));
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('300000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(BigNumber.from('300000').mul(decimals));

    // await hre.network.provider.send("evm_increaseTime", [86400 * 3]);
    // await hre.network.provider.send("evm_mine");

    // expect(await realTimelock.unreleasedBalance()).to.equal(0);
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('500000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(BigNumber.from('300000').mul(decimals));

    // await withdraw(realTimelock, account2);

    // expect(await real.balanceOf(address2)).to.equal(0);
    // expect(await real.balanceOf(address1)).to.equal(BigNumber.from('500000').mul(decimals));
    // expect(await realTimelock.unreleasedBalance()).to.equal(0);
    // expect(await realTimelock.releasedBalance()).to.equal(BigNumber.from('500000').mul(decimals));
    // expect(await realTimelock.withdrawedBalance()).to.equal(BigNumber.from('500000').mul(decimals));
  });
});
