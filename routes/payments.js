const express = require('express');
const router  = express.Router();
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('Stripe secret key not configured, payments endpoint disabled.');
}

router.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items.map(i => ({
      price_data: {
        currency: 'try',
        product_data: { name: i.name },
        unit_amount: i.price * 100
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/success`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel`
  });
  res.json({ id: session.id });
});

module.exports = router;

