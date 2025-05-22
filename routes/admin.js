const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const isAdmin = require('../middleware/isAdmin');

// ürünleri yönet
router.get('/', isAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/index', { products });
});

// yeni ürün ekleme formu
router.get('/products/new', isAdmin, (req, res) => {
  res.render('admin/new');
});
router.post('/products', isAdmin, async (req, res) => {
  await Product.create(req.body);
  req.flash('success','Ürün eklendi');
  res.redirect('/admin');
});

// ürün silme
router.post('/products/:id/delete', isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  req.flash('success','Ürün silindi');
  res.redirect('/admin');
});

module.exports = router;

