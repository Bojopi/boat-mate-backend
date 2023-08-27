import { response } from 'express';
import stripe from 'stripe';
import { Provider } from '../models/Provider.js';

const str = stripe('sk_test_51N3mL2KHtcU5N9YX9BCRudz7A2vkrUIuVAdjF1i5noVFR2mdoDva8Mu8wbWsMHwKhx2BQfL7FutZHlu4J2DKfreZ00E8ODpuvf');

export const account = async (req, res = response) => {
    const { idProvider } = req.params;
    const { email } = req.body

    try {
        const stripeAccount = await str.accounts.create({
            type: 'standard',
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
                type: 'account_onboarding'
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