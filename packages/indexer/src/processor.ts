import { lookupArchive } from '@subsquid/archive-registry'
import { 
  BlockHeader, 
  DataHandlerContext, 
  EvmBatchProcessor, 
  EvmBlock, 
  Log as EvmLog, 
  Transaction as EvmTransaction 
} from '@subsquid/evm-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { ethers } from 'ethers'
import * as erc20abi from './abi/erc20'
import * as dfundTokenAbi from './abi/DFUNDToken'
import { Account, Token, TokenHolder, Transfer } from './model'
import * as dotenv from 'dotenv'

dotenv.config()

// Define contract addresses
const DFUND_TOKEN_ADDRESS = process.env.DFUND_TOKEN_ADDRESS?.toLowerCase() || ''

// Create processor
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('ethereum-mainnet'),
    chain: 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
  })
  .setBlockRange({ from: 0 })
  .addLog(DFUND_TOKEN_ADDRESS, {
    topic0: [
      erc20abi.events.Transfer.topic, // Transfer event
    ],
    transaction: true,
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfersData: TransferData[] = []

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (log.topics[0] === erc20abi.events.Transfer.topic) {
        const transfer = handleTransfer(block.header, log)
        transfersData.push(transfer)
      }
    }
  }

  await processTransfers(ctx, transfersData)
})

// Event handlers
interface TransferData {
  id: string
  from: string
  to: string
  tokenAddress: string
  amount: bigint
  block: BlockHeader
  transaction: EvmTransaction
  eventIndex: number
}

function handleTransfer(
  block: BlockHeader,
  log: EvmLog
): TransferData {
  const event = erc20abi.events.Transfer.decode(log)
  
  const from = event.from.toLowerCase()
  const to = event.to.toLowerCase()
  const tokenAddress = log.address.toLowerCase()
  const transaction = log.transaction!
  
  return {
    id: `${transaction.hash}-${log.logIndex}`,
    tokenAddress,
    from,
    to,
    amount: event.value,
    block,
    transaction,
    eventIndex: log.logIndex
  }
}

async function processTransfers(ctx: DataHandlerContext<Store>, transfersData: TransferData[]) {
  // Get unique tokens and accounts
  const tokenAddresses = new Set<string>()
  const accountAddresses = new Set<string>()

  for (const transfer of transfersData) {
    tokenAddresses.add(transfer.tokenAddress)
    accountAddresses.add(transfer.from)
    accountAddresses.add(transfer.to)
  }

  // Load existing tokens
  const tokens = await ctx.store.findBy(Token, {
    id: [...tokenAddresses],
  }).then((tokens) => {
    return new Map(tokens.map((token) => [token.id, token]))
  })

  // Load existing accounts
  const accounts = await ctx.store.findBy(Account, {
    id: [...accountAddresses],
  }).then((accounts) => {
    return new Map(accounts.map((account) => [account.id, account]))
  })

  // Create new tokens and accounts
  for (const tokenAddress of tokenAddresses) {
    if (!tokens.has(tokenAddress)) {
      // Need to fetch token details from blockchain
      const token = new Token({
        id: tokenAddress,
        name: 'DeFi DAO Fund Token', // Placeholder - should fetch from contract
        symbol: 'DFUND', // Placeholder - should fetch from contract
        decimals: 18, // Placeholder - should fetch from contract
        totalSupply: 0n // Placeholder - should fetch from contract
      })
      tokens.set(tokenAddress, token)
      await ctx.store.save(token)
    }
  }

  for (const accountAddress of accountAddresses) {
    if (!accounts.has(accountAddress)) {
      const account = new Account({
        id: accountAddress,
      })
      accounts.set(accountAddress, account)
      await ctx.store.save(account)
    }
  }

  // Process transfers
  const transfers: Transfer[] = []
  const tokenHolderIds = new Set<string>()

  for (const transferData of transfersData) {
    const { id, from, to, tokenAddress, amount, block, transaction } = transferData

    const fromTokenHolderId = `${from}:${tokenAddress}`
    const toTokenHolderId = `${to}:${tokenAddress}`

    tokenHolderIds.add(fromTokenHolderId)
    tokenHolderIds.add(toTokenHolderId)

    const transfer = new Transfer({
      id,
      blockNumber: block.height,
      timestamp: new Date(block.timestamp),
      txHash: transaction.hash,
      from: accounts.get(from)!,
      to: accounts.get(to)!,
      token: tokens.get(tokenAddress)!,
      amount: amount
    })

    transfers.push(transfer)
  }

  // Load token holders
  const tokenHolders = await ctx.store.findBy(TokenHolder, {
    id: [...tokenHolderIds],
  }).then((tokenHolders) => {
    return new Map(tokenHolders.map((th) => [th.id, th]))
  })

  // Update token holders
  for (const transferData of transfersData) {
    const { from, to, tokenAddress, amount } = transferData
    
    // Skip burn/mint for this example
    if (from !== '0x0000000000000000000000000000000000000000' && 
        to !== '0x0000000000000000000000000000000000000000') {
      
      const fromTokenHolderId = `${from}:${tokenAddress}`
      const toTokenHolderId = `${to}:${tokenAddress}`
      
      // Update sender balance
      let fromTokenHolder = tokenHolders.get(fromTokenHolderId)
      if (!fromTokenHolder) {
        fromTokenHolder = new TokenHolder({
          id: fromTokenHolderId,
          address: accounts.get(from)!,
          token: tokens.get(tokenAddress)!,
          balance: 0n
        })
        tokenHolders.set(fromTokenHolderId, fromTokenHolder)
      }
      
      fromTokenHolder.balance -= amount
      
      // Update receiver balance
      let toTokenHolder = tokenHolders.get(toTokenHolderId)
      if (!toTokenHolder) {
        toTokenHolder = new TokenHolder({
          id: toTokenHolderId,
          address: accounts.get(to)!,
          token: tokens.get(tokenAddress)!,
          balance: 0n
        })
        tokenHolders.set(toTokenHolderId, toTokenHolder)
      }
      
      toTokenHolder.balance += amount
    }
  }

  // Save all transfers and updated token holders
  await ctx.store.save([...tokenHolders.values()])
  await ctx.store.save(transfers)
}