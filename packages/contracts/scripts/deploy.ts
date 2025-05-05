import { ethers, upgrades } from 'hardhat';

async function main() {
  console.log('Deploying DeFi-DAO-Fund contracts...');

  // Deploy the DFUND token
  const DFUNDToken = await ethers.getContractFactory('DFUNDToken');
  console.log('Deploying DFUNDToken...');
  
  const initialSupply = ethers.parseEther('1000000'); // 1 million tokens with 18 decimals
  
  const dfundToken = await upgrades.deployProxy(
    DFUNDToken,
    [initialSupply],
    { kind: 'uups' }
  );
  
  await dfundToken.waitForDeployment();
  const dfundTokenAddress = await dfundToken.getAddress();
  
  console.log('DFUNDToken deployed to:', dfundTokenAddress);

  // Deploy the FundManager
  const FundManager = await ethers.getContractFactory('FundManager');
  console.log('Deploying FundManager...');
  
  const fundManager = await upgrades.deployProxy(
    FundManager,
    [dfundTokenAddress],
    { kind: 'uups' }
  );
  
  await fundManager.waitForDeployment();
  const fundManagerAddress = await fundManager.getAddress();
  
  console.log('FundManager deployed to:', fundManagerAddress);

  console.log('Deployment completed successfully!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});