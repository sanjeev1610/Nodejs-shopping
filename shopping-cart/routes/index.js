var express = require('express');
var router = express.Router();
var csrf = require('csurf');


var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, doc){
    var productChunk = [];
    var chunkSize = 3;
    for(var i=0; i<doc.length; i+= chunkSize){
      productChunk.push(doc.slice(i, i + chunkSize));
      
    }
    res.render('shop/index', { title: 'Shopping Cart', 
    products: productChunk ,successMsg: successMsg, noMessages: !successMsg});

  });
});

router.get('/add-to-cart/:id', function(req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if(err) {
      return res.redirect('/');
    }

    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');

  });

});


router.get('/reduce/:id', (req,res,next)=>{
  var pid = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(pid);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req,res,next)=>{
  var pid = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(pid);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})


router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});

  }
  var cart = new Cart(req.session.cart);
   res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})


router.get('/checkout', isLoggedIn, (req,res,next)=>{
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }

var cart = new Cart(req.session.cart);
var errMsg = req.flash('error')[0];
res.render('shop/checkout', {csrfToken: req.csrfToken(),total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});

});

router.post('/checkout', isLoggedIn, (req,res,next)=>{
  if(!req.session.cart) {
    return res.redirect('/shopping-cart')
  }
  var cart = new Cart(req.session.cart);


  // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")("sk_test_a5pGCdXcdUzYhjM2t5o9ogep00EHH8Lwlr");

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
const token = req.body.stripeToken; // Using Express

(async () => {
  const charge = await stripe.charges.create({
    amount: cart.totalPrice*100,
    currency: 'inr',
    description: "Test Charge",
    source: token,
  }, (err,charge) =>{
    if(err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }

    var orders = new Order({
      user: req.user,
      cart : cart,
      address: req.body.address,
      paymentId: charge.id
    });

    orders.save(function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('/checkout')
      }
      req.flash('success', 'Successfully bought product');
      req.session.cart = null;
      res.redirect('/')
    });

    
  });
})();

});



function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldurl = req.url;
  res.redirect('/user/signin');
}
module.exports = router;









