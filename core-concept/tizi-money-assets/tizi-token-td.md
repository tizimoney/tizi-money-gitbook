# Tizi Token (TD)

A risk-minimised USDC-pegged crypto asset backed by an underlying basket of assets.

TD is a rebasing ERC20 token, fully collateralised with assets that can be (possibly instantly) converted into USDC.

To ensure that TD always maintains parity with the value of the underlying assets, the project implements a rebase mechanism. The formula for the rebase mechanism is shown in equation (1). In this formula,  $$r$$ represents the ratio of USDC to TD tokens in the project,  $$USDC$$ represents the Net Present Value of USDCs and other tokens value converted to USDC in all the chains in the project, and $$TD$$ represents the quantity of TD tokens in the project. The initial value of $$r$$ is set to 1.

$$
r=\frac {USDC} {TD}
$$

The Net Present Value of the project is the sum of USDC in the MainVault (yet to be distributed) plus USDC on different chains in the project and the USDC converted from other tokens in the project collected by different strategies.

$$
NPV=USDC_m+USDC_p+USDC_c
$$

The value of a user’s TD assets is shown in formula (3),  where $$a_u$$ represents a user’s assets, $$TD_u$$represents the amount of TD held by the user in the project, and  $$r$$ represents the ratio of USDC to TD in the project.

$$
a_u=TD_u*r
$$

A rebase token can experience Profit (positive rebase) when the collateral value exceeds 100% and Loss (negative rebase) when r falls below 100%. Please note that you assume the propotional risk of all protocols in the TD Collateral. Profit distribution occur through daily rebasing, providing transparent balance and P/L visibility.

The pegging mechanism is based on the ‘NAV of 1’ policy (“Net Asset Value”), i.e. market value of assets equals the amount of TD in circulation. This is achieved by:

Conservative risk management aims to avoid daily losses by building a diversified portfolio of highly conservative DeFi Investments

Daily distribution of profits in the form of a rebase to TD holders; all yield collected by the TD reserves are distributed to TD holders directly by increasing their wallet balance once a day.

An **r\_t** variable is used to reflect the ratio between the current TD token supply and the strategy asset amount, with this index denominated in USDC.

Internally, balances are stored in the Vault, and admin functions are protected by a timelock contract. When using the `mint()` and `redeem()` methods of DepositHelper, the value of r\_t is adjusted accordingly.

The manager can bridge and allocate USDC across different blockchains via the VAULT. The allocation of USDC within the VAULT to specific investment strategies is determined by the Decentralized Autonomous Organization (DAO) through voting, and this allocation is executed by the manager. When the target investment strategy is not on the main chain, the manager bridges a portion of USDC from the VAULT on the main chain to the VAULT on another chain.
