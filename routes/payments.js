const express = require('express');
const router  = express.Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
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

