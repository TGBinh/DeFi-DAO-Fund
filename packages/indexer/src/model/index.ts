import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text")
    name!: string

    @Column_("text")
    symbol!: string

    @Column_("int4")
    decimals!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    totalSupply!: bigint
}

@Entity_()
export class TokenHolder {
    constructor(props?: Partial<TokenHolder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: false})
    address!: Account

    @Index_()
    @ManyToOne_(() => Token, {nullable: false})
    token!: Token

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    balance!: bigint
}

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => TokenHolder, e => e.address)
    tokens!: TokenHolder[]

    @OneToMany_(() => Transfer, e => e.from)
    transfersOut!: Transfer[]

    @OneToMany_(() => Transfer, e => e.to)
    transfersIn!: Transfer[]

    @OneToMany_(() => GovernanceParticipation, e => e.account)
    governance!: GovernanceParticipation
}

@Entity_()
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4")
    blockNumber!: number

    @Column_("timestamp with time zone")
    timestamp!: Date

    @Column_("text")
    txHash!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: false})
    from!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: false})
    to!: Account

    @Index_()
    @ManyToOne_(() => Token, {nullable: false})
    token!: Token

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    amount!: bigint
}

@Entity_()
export class GovernanceParticipation {
    constructor(props?: Partial<GovernanceParticipation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: false})
    account!: Account

    @OneToMany_(() => Proposal, e => e.creator)
    proposalsCreated!: Proposal[]

    @OneToMany_(() => Vote, e => e.voter)
    votes!: Vote[]
}

@Entity_()
export class Proposal {
    constructor(props?: Partial<Proposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text")
    title!: string

    @Column_("text")
    description!: string

    @Index_()
    @ManyToOne_(() => GovernanceParticipation, {nullable: false})
    creator!: GovernanceParticipation

    @Column_("int4")
    startBlock!: number

    @Column_("int4")
    endBlock!: number

    @Column_("text")
    status!: string

    @OneToMany_(() => Vote, e => e.proposal)
    votes!: Vote[]

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    forVotes!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    againstVotes!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    abstainVotes!: bigint

    @Column_("bool")
    executed!: boolean
}

@Entity_()
export class Vote {
    constructor(props?: Partial<Vote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Proposal, {nullable: false})
    proposal!: Proposal

    @Index_()
    @ManyToOne_(() => GovernanceParticipation, {nullable: false})
    voter!: GovernanceParticipation

    @Column_("text")
    support!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer})
    weight!: bigint

    @Column_("text", {nullable: true})
    reason!: string | undefined | null

    @Column_("timestamp with time zone")
    timestamp!: Date
}