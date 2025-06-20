# Strategies

The overarching principles of the investment strategy are

* Risk over return: The strategies target positive daily yields with a moderately low exposure to risks, such that in the normal course of operation, all daily rebases are expected to be positive.
* Holders in control: As the market develops, new strategies will be added. Since the new strategies will be deployed with a timelock, those who are not comfortable with the new strategies will have time to redeem their holdings.

Tizi deploys funds to multiple strategies that can be broadly classified as delta neutral yield sources.

The MainVault and SubVault are two types of smart contracts managed by the Manager for strategy contracts and bridging USDC.  The MainVault smart contract is deployed on the Base chain, while the SubVault smart contract is deployed on other chains.  For the Manager role, they have several common methods available:

deposit - A method for depositing assets into the strategy for management

withdraw: - A method for withdrawing assets from the strategy. It allows for partial or full withdrawal of assets

check: - Retrieves the total amount of all assets in the strategy contract, including the amount of USDC and the number of staking tokens.

harvest - Starts collecting (claiming) rewards, if provided by the strategy

enterFarm - Transfers assets to the strategy contract, allowing partial or full transfer

exitFarm - Transfers assets from the strategy contract to the MainVault or SubVault contract, allowing partial or full transfer

bridgeIn - Bridges assets from other chains to the MainVault or SubVault contract on the current chain, allowing partial or full transfer

bridgeOut - Bridges assets to the MainVault or SubVault contract on other chains, allowing partial or full transfer
