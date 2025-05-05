# DeFi-DAO-Fund Monorepo

A Monorepo for DeFi DAO Fund, managing smart contracts, Subsquid indexer, and cross-chain functionality.

## Project Overview

DeFi-DAO-Fund is a decentralized autonomous organization (DAO) built on EVM-compatible blockchains (Ethereum, Polygon, BSC) that enables:

- Tokenization through ERC20 standard tokens
- On-chain governance mechanisms
- Automated profit distribution
- Strategic DeFi investment operations
- AI-powered analytics 
- Oracle-based data feeds
- Cross-chain functionalities
- Enhanced security features

The project follows a monorepo approach to manage all components in a single repository, making development and deployment more efficient.

## Installation

```bash
# Clone the repository
git clone https://github.com/TGBinh/DeFi-DAO-Fund.git
cd DeFi-DAO-Fund

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your .env file with appropriate API keys and private keys
```

## Project Structure

```
DeFi-DAO-Fund/
├── packages/
│   ├── contracts/          # Smart contract package
│   │   ├── src/            # Solidity smart contracts
│   │   ├── scripts/        # Deployment and utility scripts
│   │   ├── tests/          # Unit and integration tests
│   │   ├── hardhat.config.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.json
│   ├── indexer/            # Subsquid Indexer package
│   │   ├── src/            # TypeScript files for the indexer
│   │   ├── schema.graphql  # Schema definition for the indexer
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.json
├── .github/workflows/      # CI/CD workflows
├── .gitignore
├── .env.example            # Template for environment variables
├── package.json            # Root package.json with workspaces
├── tsconfig.json           # Root TypeScript config
├── .eslintrc.json          # Root ESLint config
└── README.md
```

## Contribution Guidelines

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch for integration
- Feature branches: Created from `develop` using format `feature/*`

### Pull Request Process

1. Create a feature branch from `develop`
2. Implement changes with appropriate tests
3. Ensure CI pipeline passes
4. Create a PR to `develop`
5. Wait for code review and approval
6. Merge to `develop`

### Coding Standards

- Follow Solidity style guide
- Use TypeScript for scripting and testing
- Document all functions with NatSpec comments
- Maintain minimum 80% test coverage
- Run slither analysis before submitting PRs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.