import { response } from 'express';
import stripe from 'stripe';
import { Provider } from '../models/Provider.js';

const str = stripe('sk_test_51N3mL2KHtcU5N9YX9BCRudz7A2vkrUIuVAdjF1i5noVFR2mdoDva8Mu8wbWsMHwKhx2BQfL7FutZHlu4J2DKfreZ00E8ODpuvf');

export const createAccount = async (req, res = response) => {
    const { idProvider } = req.params;
    const { 
        email, 
        city,
        address, 
        shortCountry, 
        postalCode,
        phone,
        businessName
    } = req.body

    try {
        const stripeAccount = await str.accounts.create({
            type: 'express',
            country: 'US',
            email,
            business_type: 'company',
            company: {
                address: {
                    city: city,
                    country: shortCountry,
                    line1: address,
                    postal_code: postalCode
                },
                phone: phone
            },
            business_profile: {
                name: businessName,
                support_address: {
                    city: city,
                    country: shortCountry,
                    line1: address,
                    postal_code: postalCode
                },
                support_email: email,
                support_phone: phone
            }
        })

        if(stripeAccount) {
            await Provider.update({
                provider_id_stripe: stripeAccount.id
            }, {
                where: {id_provider: idProvider}
            });

            // const accountLink = await str.accountLinks.create({
            //     account: stripeAccount.id,
            //     refresh_url: 'http://localhost:3000/welcome/profile',
            //     return_url: 'http://localhost:3000/welcome/profile',
            //     type: 'account_onboarding'
            // })
            
            res.status(200).json({
                msg: 'Stripe Account Created',
                stripeAccount,
                // accountLink
            });
        }

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

        res.status(200).json({
            msg: 'Payment Method Created',
            paymentMethod,
        });

    } catch (error) {
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