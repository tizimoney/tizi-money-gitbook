# Manager and ADMIN

Manager and Admin are two roles set up for permission management in the smart contract.  The Manager role is appointed and revoked by the Admin.

Manager is responsible for managing and investing USDC in the project.  In terms of fund management, the Manager ensures that the project's funds are sufficient to maintain normal operations by reserving a portion of the project funds and regularly withdrawing USDC stored in strategies back to the project.

The Manager is in charge of operations including bridging USDC between chains, depositing and withdrawing funds into farming strategies, triggering harvesting operations and rebalancing liquidity between strategies and chains.

All actions of the Manager are strictly regulated in the contract; USDC can only circulate between various contracts within the project and cannot be traded to individuals.
