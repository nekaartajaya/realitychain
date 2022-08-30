export {};

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers")

describe("RealToken", function () {
  it("Testing scenario for contract 'RealToken'", async function () {
    const RealToken = await ethers.getContractFactory("RealToken");
    const real = await RealToken.deploy();
    await real.deployed();
    const decimals = BigNumber.from('1000000000000000000');

    expect(await real.totalSupply()).to.equal(BigNumber.from('100000000').mul(decimals));

    const [owner, account1, account2] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    const address1 = await account1.getAddress();
    const address2 = await account2.getAddress();

    expect(await real.balanceOf(ownerAddress)).to.equal(BigNumber.from('100000000').mul(decimals));

    var tx = await real.transfer(address1, BigNumber.from('20000000').mul(decimals));
    await tx.wait();
    expect(await real.balanceOf(address1)).to.equal(BigNumber.from('20000000').mul(decimals));

    tx = await real.transfer(address2, BigNumber.from('30000000').mul(decimals));
    await tx.wait();
    expect(await real.balanceOf(address2)).to.equal(BigNumber.from('30000000').mul(decimals));

    tx = await real.connect(account1).transfer(address2, BigNumber.from('5000000').mul(decimals));
    await tx.wait();
    expect(await real.balanceOf(address1)).to.equal(BigNumber.from('15000000').mul(decimals));
    expect(await real.balanceOf(address2)).to.equal(BigNumber.from('35000000').mul(decimals));

    tx = await real.connect(account2).transfer(address1, BigNumber.from('10000000').mul(decimals));
    await tx.wait();
    expect(await real.balanceOf(address1)).to.equal(BigNumber.from('25000000').mul(decimals));
    expect(await real.balanceOf(address2)).to.equal(BigNumber.from('25000000').mul(decimals));
  });
});
