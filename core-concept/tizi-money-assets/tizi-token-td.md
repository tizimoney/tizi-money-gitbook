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
