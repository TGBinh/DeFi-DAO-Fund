import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import * as erc20 from './erc20'

export const abi = new ethers.Interface([
    'function initialize(uint256 initialSupply) public',
    'function mint(address to, uint256 amount) public',
    'function burn(address from, uint256 amount) public',
    'function pause() public',
    'function unpause() public',
    'function upgradeToAndCall(address newImplementation, bytes data) public payable',
    ...erc20.abi.fragments
])

export const events = {
    ...erc20.events
}

export const functions = {
    ...erc20.functions,
    initialize: new Func<[initialSupply: bigint], [], []>(
        abi, '0x40c10f19'
    ),
    mint: new Func<[to: string, amount: bigint], [], []>(
        abi, '0x40c10f19'
    ),
    burn: new Func<[from: string, amount: bigint], [], []>(
        abi, '0x9dc29fac'
    ),
    pause: new Func<[], [], []>(
        abi, '0x8456cb59'
    ),
    unpause: new Func<[], [], []>(
        abi, '0x3f4ba83a'
    )
}