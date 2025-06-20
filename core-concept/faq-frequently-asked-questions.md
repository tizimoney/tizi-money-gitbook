# FAQ (Frequently Asked Questions)

#### 1. How does the rebasing work? Explain it like I'm 5

When you put in money, you get a ticket called TD for each dollar. The money is then moved to several places on different chains where it can grow. Every day, the money in each of those places is counted, and those amounts are put together to find how much the money has grown. The amount of TD in your wallet then grows to match that amount. This all happens automatically without you having to do anything.

#### 2. How does the rebasing work? Explain it like I'm michwill

The farms, comprising both capital and earned reward tokens, can be represented as a set of tuples $$f_i = (a, \delta,\tau)$$ where an amount $$a$$ of token $$\delta$$ is movable no earlier than at time $$\tau$$, where a value of $$\tau$$ in the future indicates a token subject to a lock up while past values indicate a currently liquid token.

Using the function $$o(\delta)$$ to represent the current market price of token $$\delta$$ (via an oracle), and defining the net present value function $$V$$ as

$$
V(x,\tau) = \begin{cases} x \cdot o(\delta) \cdot (1+x)^{\tau-t} & \text{if } t < \tau \\ x \cdot o(\delta) & \text{if } t \geq \tau \end{cases}
$$

where $$d$$ is a discount rate, we define the current net present value of all farms as

$$
n=\sum_i V(f_i)
$$

and at each rebase, the number of circulating TD is adjusted to match $$n$$.

#### 3. Is Tizi a fork?

No; Tizi is built from the ground up. It does, however, extend the work of other DeFi builders. The multichain rebasing aspect of TD is based on [work by Tangible DAO](https://github.com/TangibleTNFT/tangible-foundation-contracts/blob/main/src/tokens/LayerZeroRebaseTokenUpgradeable.sol). The design of vault and farm contracts, while not a fork, is inspired by other yield aggregators which were in turn inspired by [Yearn](https://yearn.fi/).

#### 4. Which bridge does Tizi use?

Bridges are used for two distinct purposes: passing messages (for example, for rebase calculations) and for moving the underlying assets. While Tizi is bridge agnostic at the core, these are the bridges it currently uses:

|             | Moving USDC          | Message passing      |
| ----------- | -------------------- | -------------------- |
| Circle CCTP | :heavy\_check\_mark: |                      |
| Axelar      |                      | :heavy\_check\_mark: |
| Layer Zero  | :heavy\_check\_mark: | :heavy\_check\_mark: |

#### 5. Wen token?

We have no governance token and no current plans to issue one. Anyone offering to sell or give you such tokens is a scammer.

We expect early users of the protocol to be allocated a portion of the governance token we're not planning to have. :wink:

#### 6. What are the risk factors and what are the solutions?

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
