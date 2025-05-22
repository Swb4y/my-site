const express = require('express');
const router  = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

const env = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(env);

router.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'TRY',
        value: req.body.total.toFixed(2)
      }
    }]
  });
  const order = await client.execute(request);
  res.json({ id: order.result.id });
});

router.post('/capture-order', async (req, res) => {
  const request = new paypal.orders.OrdersCaptureRequest(req.body.id);
  request.requestBody({});
  const capture = await client.execute(request);
  res.json(capture.result);
});

module.exports = router;

