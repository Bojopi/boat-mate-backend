import { response } from 'express';
import stripe from 'stripe';
import { Provider } from '../models/Provider.js';
import { serialize } from "cookie";
import { Profile } from '../models/Profile.js';
import { Person } from '../models/Person.js';
import { Role } from '../models/Role.js';
import { updateJWT } from '../helpers/generate-jwt.js';

const str = stripe('sk_test_51N3mL2KHtcU5N9YX9BCRudz7A2vkrUIuVAdjF1i5noVFR2mdoDva8Mu8wbWsMHwKhx2BQfL7FutZHlu4J2DKfreZ00E8ODpuvf');

const endpointSecret = 'whsec_07d85145aca56c4df4c48efc4e122a0a1cf292c9ab816702f1fb801670543dbf'

export const createExpressAccount = async (req, res = response) => {
    const { idProvider } = req.params;
    const { tokenUser } = req.cookies;

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

            const resUser = await Provider.findOne({
                attributes: [
                    'id_provider',
                    'provider_id_stripe',
                    'provider_name',
                    'provider_image',
                    'provider_description',
                    'provider_lat',
                    'provider_lng',
                    'provider_zip',
                    'profile.id_profile',
                    'profile.profile_state',
                    'profile.email',
                    'profile.google',
                    'profile.person.id_person',
                    'profile.person.person_name',
                    'profile.person.lastname',
                    'profile.person.phone',
                    'profile.person.person_image',
                    'profile.role.id_role',
                    'profile.role.role_description',
                ],
                where: {id_provider: idProvider},
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []
                    }]
                }],
                raw: true
            });

            //update the jwt
            const token = await updateJWT(resUser, tokenUser);

            const serialized = serialize('tokenUser', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 23,
                path: '/',
            })

            res.setHeader('Set-Cookie', serialized);

            const accountLink = await str.accountLinks.create({
                account: stripeAccount.id,
                refresh_url: 'https://boatmate.com/welcome/profile',
                // refresh_url: 'http://localhost:3000/welcome/profile',
                return_url: 'https://boatmate.com/welcome/profile',
                // return_url: 'http://localhost:3000/welcome/profile',
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
                success_url: 'http://localhost:3000/profile',
                cancel_url: 'http://localhost:3000/profile',
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

// stripe event listen
const fulfillOrder = (lineItems) => {
    console.log("Fulfilling order", lineItems);
}

export const eventPaymentComplete = async (req, res = response) => {
    console.log('=======================aqui entro')
    const payload = req.body;
    console.log('payload', payload)
    const sig = req.headers['stripe-signature'];
    console.log('sig', sig)

    let event;

    try {
        console.log('==============================esperando al evento')
        event = str.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // switch (event.type) {
    //     case 'checkout.session.completed':
    //         const checkoutSessionCompleted = event.data.object;
    //         console.log(checkoutSessionCompleted)
    //         break;
    
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    if(event.type === 'checkout.session.completed') {
        const sessionWithLineItems = await str.checkout.sessions.retrieve(
            event.data.object.id,
            {
                expand: ['line_items']
            }
        )

        const lineItems = sessionWithLineItems.line_items;

        console.log(lineItems)
        fulfillOrder(lineItems)

        res.status(200).end()
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

export const getCardData = async (req, res = response) => {
    const { idStripe } = req.params;
    try {
        const cards = await str.accounts.listExternalAccounts(
            idStripe,
            { object: 'card' }
        );
        res.status(200).json({cards})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: error.message});
    }
}

export const updateCardData = async (req, res = response) => {
    const { stripeId } = req.params;
    try {
        const cards = await str.accounts.listExternalAccounts(
            stripeId,
            { object: 'card' }
        );
        res.status(200).json({cards})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: error.message});
    }
}