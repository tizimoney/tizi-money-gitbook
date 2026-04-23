# Roles

In the smart contracts, four roles are established for access control: **Admin**, **Manager**, **Prover**, and **Strategy Manager**. The appointment and revocation of all other roles are handled by the System Admin.

**Manager**: The Manager is responsible for managing and investing the project's USDC. In terms of fund management, the Manager ensures sufficient funds for normal operations by retaining a portion of the project's funds and periodically withdrawing USDC stored in strategies back to the project. The Manager handles operations such as transferring USDC across chains, depositing and withdrawing funds in yield-farming strategies, executing harvests, and adjusting liquidity between strategies and chains. All operations performed by the Manager in the contracts are subject to strict rules and limitations. USDC can only circulate between internal project contracts and cannot be traded with individuals.

**Admin**: The System Admin is responsible for the appointment and revocation of other management roles, adjusting all important contract parameters, and sending messages across different chains. The System Admin is the most critical role and holds authority over all non-fund-related operations. The sole System Admin privilege has been assigned to a multi-signature wallet.

**Prover**: The Prover is solely used to sign messages during the message transmission process to prevent replay attacks and does not hold any other authority. Appointment and removal are determined by the System Admin.

**Strategy Manager**: The Strategy Manager is responsible for operations related to self-built strategies.
