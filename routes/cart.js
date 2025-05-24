// routes/cart.js

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('cart', {
    title: 'Sepetim',
    description: 'Alışveriş sepetiniz',
    keywords: 'sepet, cart',
    headerTitle: 'Sepetiniz'
  });
});

module.exports = router;

