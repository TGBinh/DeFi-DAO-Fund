import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-chai-matchers';
import 'hardhat-deploy';
import 'solidity-coverage';
import '@openzeppelin/hardhat-upgrades';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
    polygon: {
      url: `https://polygon-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  paths: {
    sources: './src',
    tests: './tests',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;