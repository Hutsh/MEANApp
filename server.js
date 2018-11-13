var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var swig = require('swig')
var product = require('./product');

app.engine('html', swig.renderFile) //
app.set('views', './views')
app.set('view engine', 'html')
swig.setDefaults({ cache: false }) // disable chche

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();
var router_index = express.Router();


// all other code will go here
mongoose.connect('mongodb://localhost:27017/products', { useNewUrlParser: true }); 

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});

router_index.route('/').get(function (req, res) {
	console.log('eee')
	product.find(function (err, products) {
	    if (err) {
	        res.send(err);
	    }
	    console.log(products)
	    res.render('index', {
	    	products: products
	    })
	    // res.send(products);
	});

});

// POST products
router.route('/products').post(function (req, res) {
    var p = new product();
    p.title = req.body.title;
    p.price = req.body.price;
    p.instock = req.body.instock;
    p.photo = req.body.photo;
    p.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.send({ message: 'Product Created !' })
    })
});

// GET products
router.route('/products').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {
            res.send(err);
        }
        res.send(products);
    });
});


// GET /products/:product_id
router.route('/products/:product_id').get(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});


// PUT /products/:product_id
router.route('/products/:product_id').put(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err) {
            res.send(err);
        }
        prod.title = req.body.title;
        prod.price = req.body.price;
        prod.instock = req.body.instock;
        prod.photo = req.body.photo;
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product updated!' });
        });

    });
});


// DELETE /products/:product_id
router.route('/products/:product_id').delete(function (req, res) {

	console.log(req.params.product_id)
    product.remove({ _id: req.params.product_id }, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});


app.use(cors());
app.use('/api', router);
app.use('/', router_index);
app.listen(port);
console.log('REST API is runnning at ' + port);