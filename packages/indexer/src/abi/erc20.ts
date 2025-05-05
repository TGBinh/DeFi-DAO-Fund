import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'

export const abi = new ethers.Interface([
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address,address) view returns (uint256)',
    'function transfer(address,uint256) returns (bool)',
    'function approve(address,uint256) returns (bool)',
    'function transferFrom(address,address,uint256) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
])

export const events = {
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
}

export const functions = {
    name: new Func<[], [string], []>(
        abi, '0x06fdde03'
    ),
    symbol: new Func<[], [string], []>(
        abi, '0x95d89b41'
    ),
    decimals: new Func<[], [number], []>(
        abi, '0x313ce567'
    ),
    totalSupply: new Func<[], [bigint], []>(
        abi, '0x18160ddd'
    ),
    balanceOf: new Func<[account: string], [bigint], []>(
        abi, '0x70a08231'
    ),
    allowance: new Func<[owner: string, spender: string], [bigint], []>(
        abi, '0xdd62ed3e'
    ),
    transfer: new Func<[to: string, amount: bigint], [boolean], []>(
        abi, '0xa9059cbb'
    ),
    approve: new Func<[spender: string, amount: bigint], [boolean], []>(
        abi, '0x095ea7b3'
    ),
    transferFrom: new Func<[from: string, to: string, amount: bigint], [boolean], []>(
        abi, '0x23b872dd'
    ),
}