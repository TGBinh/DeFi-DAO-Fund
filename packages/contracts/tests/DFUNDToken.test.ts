import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { DFUNDToken } from '../typechain-types';

describe('DFUNDToken', () => {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const DFUNDTokenFactory = await ethers.getContractFactory('DFUNDToken');
    const dfundToken = await ethers.deployContract('DFUNDToken');
    
    // Initialize the token
    const initialSupply = ethers.parseEther('1000000'); // 1 million tokens
    await dfundToken.initialize(initialSupply);
    
    return { dfundToken, owner, addr1, addr2, initialSupply };
  }

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
      const { dfundToken, owner } = await loadFixture(deployTokenFixture);
      expect(await dfundToken.owner()).to.equal(owner.address);
    });

    it('Should assign the total supply of tokens to the owner', async () => {
      const { dfundToken, owner, initialSupply } = await loadFixture(deployTokenFixture);
      const ownerBalance = await dfundToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialSupply);
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts', async () => {
      const { dfundToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      
      // Transfer 50 tokens from owner to addr1
      const transferAmount = ethers.parseEther('50');
      await dfundToken.transfer(addr1.address, transferAmount);
      
      // Check balances after transfer
      const addr1Balance = await dfundToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it('Should fail if sender doesn't have enough tokens', async () => {
      const { dfundToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await dfundToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      const transferAmount = ethers.parseEther('1');
      await expect(
        dfundToken.connect(addr1).transfer(owner.address, transferAmount)
      ).to.be.revertedWithCustomError(dfundToken, 'ERC20InsufficientBalance');

      // Owner balance shouldn't have changed
      expect(await dfundToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});