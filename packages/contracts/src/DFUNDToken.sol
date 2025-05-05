// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title DFUNDToken
 * @dev ERC20 token for the DeFi-DAO-Fund platform with upgradeable capabilities
 */
contract DFUNDToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the token with name and symbol
     * @param initialSupply Initial supply to mint to the deployer
     */
    function initialize(uint256 initialSupply) public initializer {
        __ERC20_init("DeFi DAO Fund Token", "DFUND");
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Required override for UUPS proxy pattern
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    // Additional functions will be implemented here
}