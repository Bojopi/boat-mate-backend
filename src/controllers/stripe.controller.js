import { response } from 'express';
import stripe from 'stripe';
import { Provider } from '../models/Provider.js';

const str = stripe('sk_test_51N3mL2KHtcU5N9YX9BCRudz7A2vkrUIuVAdjF1i5noVFR2mdoDva8Mu8wbWsMHwKhx2BQfL7FutZHlu4J2DKfreZ00E8ODpuvf');

export const createExpressAccount = async (req, res = response) => {
    const { idProvider } = req.params;

    try {
        const stripeAccount = await str.accounts.create({
            country: 'US',
            type: 'express',
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true
              }
            },
            business_type: 'individual',
            business_profile: {
              url: 'https://boatmate.com',
            },
        })

        if(stripeAccount) {
            await Provider.update({
                provider_id_stripe: stripeAccount.id
            }, {
                where: {id_provider: idProvider}
            });

            const accountLink = await str.accountLinks.create({
                account: stripeAccount.id,
                refresh_url: 'http://localhost:3000/welcome/profile',
                return_url: 'http://localhost:3000/welcome/profile',
                type: 'account_onboarding',
            })
            
            res.status(200).json({
                msg: 'Stripe Account Created',
                stripeAccount,
                accountLink
            });
        }

    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const loginLink = async (req, res = response) => {
    const {stripeId} = req.params;
    try {
        const loginLink = await str.accounts.createLoginLink(
            stripeId
        )

        res.status(200).json({
            loginLink,
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const accountSession = async (req, res = response) => {
    const { accountId } = req.params;
    console.log(accountId)
    try {
        const accountSessionData = await str.accountSessions.create({
            account: accountId,
            components: {
                payments: {
                    enabled: true
                }
            }
        });

        res.status(200).json({
            accountSessionData
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const oauthAccount = async (req, res = response) => {
    const { code, idProvider } = req.params;
    console.log(code, idProvider)

    try {
        const account = await str.oauth.token({
            grant_type: 'authorization_code',
            code
        });

        if(account) {
            await Provider.update({
                provider_id_stripe: account.stripe_user_id
            }, {
                where: {id_provider: idProvider}
            });

            console.log(account)

            res.status(200).json({
                msg: 'Created account',
                account
            })
        }
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const paymentIntent = async (req, res = response) => {
    const {idAccount, amount} = req.body;

    try {
        const paymentIntent = await str.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        }, {
            stripeAccount: idAccount
        });

        res.status(200).json({
            msg: 'Created paymentIntent',
            paymentIntent
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const viewAccount = async (req, res = response) => {
    try {
        const account = await str.accounts.retrieve(
            'acct_1Nm5ISGbwdHUfZ9S'
        )
        
        res.status(200).json({account})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const listCapabilities = async (req, res = response) => {
    const {idStripe} = req.params;

    try {
        const capabilities = await stripe.accounts.listCapabilities(
            idStripe
        );

        res.status(200).json({capabilities})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const checkoutSession = async (req, res = response) => {
    const {
        serviceName,
        contractDescription,
        contractPrice, 
        stripeId} = req.body
    try {
        const session = await str.checkout.sessions.create(
            {
                mode: 'payment',
                line_items: [
                    {
                        price_data:
                        {
                            currency: 'usd',
                            unit_amount: contractPrice * 100,
                            product_data:
                            {
                                name: serviceName,
                                description: contractDescription
                            }
                        }
                        ,
                        quantity: 1,
                    },
                ],
                success_url: 'https://example.com/success',
                cancel_url: 'https://example.com/cancel',
            },
            {
                stripeAccount: stripeId,
            }
        );

        res.status(200).json({
            session
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const createProductPrice = async (req, res = response) => {
    const {
        serviceName,
        contractDescription,
        contractPrice
    } = req.body;

    try {
        const product = await str.products.create({
            name: serviceName,
            description: contractDescription
        });

        if(product) {
            const price = await str.prices.create({
                unit_amount: contractPrice,
                currency: 'usd',
                product: product.id,
            });

            res.status(200).json({
                product,
                price
            })
        }
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const listAllPrices = async (req, res = response) => {
    try {
        const prices = await str.prices.list();
        res.status(200).json({
            prices
        })
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const viewPerson = async (req, res = response) => {
    try {
        const person = await str.accounts.retrievePerson(
            'acct_1NlcdnCHxGKUDlm4',
            'person_1Nld1PCHxGKUDlm4HlwZE1n4'
        )

        res.status(200).json({person})
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

export const createPaymentMethod = async (req, res = response) => {
    const { token } = req.body;
    try {
        const paymentMethod = await str.paymentMethods.create({
            type: 'card',
            card: {
                token: token
            },
        })

        console.log(paymentMethod)
        
        res.status(200).json({
            msg: 'Payment Method Created',
            paymentMethod,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: error.message});
    }
}

export const paymentMethodList = async (req, res = response) => {
    try {
        const paymentMethods = await str.customers.listPaymentMethods(
            'cus_OXBiAwFV9w1aKC',
            {type: 'card'}
        );

        res.status(200).json({
            paymentMethods
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}