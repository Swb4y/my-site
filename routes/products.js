// routes/products.js

const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// ▷ Tüm ürünleri listele
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('products/index', {
    products,
    title: 'Ürünlerimiz',
    description: 'Tüm ürünlerimiz',
    keywords: 'ürün, shop, e-ticaret',
    headerTitle: 'Ürünlerimiz'
  });
});

// ▷ Tek bir ürünü göster
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('products/show', {
    product,
    title: product.name,
    description: product.description || '',
    keywords: product.name,
    headerTitle: product.name
  });
});

module.exports = router;
