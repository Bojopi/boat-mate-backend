import stripe from 'stripe';

const str = stripe('sk_test_51N3mL2KHtcU5N9YX9BCRudz7A2vkrUIuVAdjF1i5noVFR2mdoDva8Mu8wbWsMHwKhx2BQfL7FutZHlu4J2DKfreZ00E8ODpuvf');

export const account = await str.accounts.create({
    type: 'standard'
})