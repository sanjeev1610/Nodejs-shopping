var mongoose = require('mongoose');
var Product = require('../models/product');

mongoose.connect('mongodb://127.0.0.1:27017/shopingdb', {useNewUrlParser: true});

var products = [

    new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item One',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 100
    }),


    new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item Two',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 200
    }),
    
    new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item Three',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 300
    }),
    
    new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item Four',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 400
    }),
    
    new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item Five',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 500
    }),
   new Product({
        imagePath: 'http://placehold.it/700x400',
        title: 'Item Six',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
        price: 600
    }),
];

var done = 0;
for(var i=0;i<products.length; i++) {

    products[i].save(function(err, result){
        done++;
        if(done === products.length) {
            exit();
        }
    })

}

function exit(){
    mongoose.disconnect();
}





