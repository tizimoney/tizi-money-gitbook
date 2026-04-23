# FAQ (Frequently Asked Questions)

#### 1. Is Tizi a fork?

No; Tizi is built from the ground up. It does, however, extend the work of other DeFi builders. The multichain rebasing aspect of TD is based on [work by Tangible DAO](https://github.com/TangibleTNFT/tangible-foundation-contracts/blob/main/src/tokens/LayerZeroRebaseTokenUpgradeable.sol). The design of vault and farm contracts, while not a fork, is inspired by other yield aggregators which were in turn inspired by [Yearn](https://yearn.fi/).

#### 2. Which bridge does Tizi use?

Bridges are used for two distinct purposes: passing messages (for example, for rebase calculations) and for moving the underlying assets. While Tizi is bridge agnostic at the core, these are the bridges it currently uses:

|             | Moving USDC          | Message passing      |
| ----------- | -------------------- | -------------------- |
| Circle CCTP | :heavy\_check\_mark: |                      |
| Axelar      |                      | :heavy\_check\_mark: |
| Layer Zero  | :heavy\_check\_mark: | :heavy\_check\_mark: |

#### 3. Wen token?

We have no governance token and no current plans to issue one. Anyone offering to sell or give you such tokens is a scammer.

We expect early users of the protocol to be allocated a portion of the governance token we're not planning to have. :wink:

#### 4. What are the risk factors and what are the solutions?

*   Occasionally a cross-chain bridge stops functioning properly. In that case, the funds will be temporarily locked on the current chain and cannot be transferred across chains until the bridge status returns to normal.

    Tizi’s solutions: if the pools on the home chain Base are not empty, the applicant can immediately access the normal funds. When the pools on home chain are fully redeemed and other funds are locked on other chains, Tizi will provide NFT credentials for affected users during the waiting time. The NFTs can also be cashed out in advance through market transactions.
*   Depeg: If USDC loses a significant amount of value in the market, the market value of TD should be expected to fall accordingly, since TD is backed by USDC and other investments that are delta-neutral to USDC. If the depeg is temporary, we can likewise expect TD to recover together with USDC.

    Solution: no solution needed.
*   Each of the strategies carries some risk of its underlying protocol, including risks of exploits and smart contract bugs.

    Solution: Over time, Tizi will accumulate an insurance fund to cover potential shortfalls. If the loss exceeds the fund, TD holders could be subjected to a negative rebase
*   Liquidity risk: If a substantial amount of TD is withdrawn at the same time, the liquid strategies could be depleted, forcing users to wait for a length of time for their withdrawal to become available.

    Solution: in the future, Tizi will introduce a liquidity protection module where users may stake their TD for a lock period, thus becoming holders of last resort, and therefore ensuring enough liquidity for general users to exit first.
*   Centralization risk: Since the transfer of USDC from Base chain to Sei chain needs to go through Base->Noble->Sei path, an EOA address is required on Noble chain to receive USDC. Please operate under the condition of trusting the admin.

    Solution: Publicize the EOA address and strictly monitor it. When multi-signature wallets are supported on Noble, multi-signature wallets will be used instead.

#### 5. How does Tizi mitigate centralization risks?

First, we ensure priority withdrawal of pending USDC from NFTs. When there is pending USDC in NFTs, the administrator cannot transfer more than that amount from the mainVault, nor can they deploy new strategies or new vaults. The administrator can relay liquidity information across chains via LayerZero.

After a new strategy is deployed, it will not be activated immediately. It must wait at least 3 days and ensure sufficient liquidity. During this period, users can audit the strategy. If users object to the new strategy, they can opt out before it takes effect. The strategy will not be used unless users who have exited receive corresponding compensation.

Upgrade authority is granted to the TimeLock contract. Upgrades will not take effect immediately; they also require a minimum 3-day waiting period, sufficient liquidity, and confirmation that no other addresses possess upgrade authority. In the future, we will transfer admin privileges to a multi-signature wallet to further reduce centralization risks.
