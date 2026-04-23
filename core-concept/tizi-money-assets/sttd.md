# stTD

When users stake TD, they receive stTD; the staked TD enters the staking pool.

TD maintains a 1:1 peg with USDC. As the USDC deployed across various strategies generates yield, the TD in the staking pool increases accordingly.

The project's Net Present Value (NPV) calculation comprises three components: USDC in the main wallet that has not yet been distributed, cross-chain USDC held across multiple chains, and USDC collected through various strategies and swapped from other tokens.

$$
NPV=USDC_m+USDC_p+USDC_c
$$

If the Net Present Value (NPV) exceeds the current total assets (netAssets), positive asset growth occurs, and TD equivalent to NPV minus netAssets is minted into the staking pool; this incremental amount is then linearly released over the subsequent 7 days. If the NPV falls below the current total assets (netAssets), negative asset growth occurs, and TD equivalent to netAssets minus NPV is burned from the staking pool. Subsequently, netAssets is set to the Net Present Value.

As the TD in the staking pool increases, the stTD-to-TD exchange ratio grows over time. The ratio follows the ERC4626 standard design, as shown in formulas (2) and (3), where totalShares represents the quantity of stTD, and totalAssets represents the quantity of released TD in the staking pool.

$$
Assets = Shares * (totalAssets / totalShares)
$$

$$
Shares = Assets * (totalShares / totalAssets)
$$

Unstaking stTD requires a 7-day waiting period, after which it can be redeemed for TD.

stTD functions identically to TD and can be used cross-chain.
