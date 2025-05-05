import * as ethers from 'ethers'

export class LogEvent<Args extends any[]> {
    address?: string
    topics?: Array<string>

    constructor(public abi: ethers.Interface, public topic: string) {
        this.topics = [topic]
    }

    decode(log: {topics: string[], data: string}): any {
        try {
            return this.abi.parseLog({ 
                topics: log.topics, 
                data: log.data 
            })?.args
        } catch (err) {
            console.error(`Error decoding event: ${err}`)
            throw err
        }
    }
}

export class Func<Args extends any[], Result extends any[], Payable extends boolean> {
    constructor(public abi: ethers.Interface, public sighash: string) {}
}

export class ContractBase {
    constructor(public address: string, public abi: ethers.Interface) {}
}