const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product');
const { categoryModel, validateCategory } = require('../models/category');
const upload = require('../config/multer_config');
const validateAdmin = require('../middlewares/admin');

// Get all products
router.get('/', async function (req, res) {
    try {
        const prods = await productModel.find(); // Await the promise
        res.send(prods); 
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
});

router.post('/', upload.single("image"), async function (req, res) {
    try {
        // Extract the fields from the request body
        let { name, price, category, stock, description } = req.body;

        // Validate the product details
        let { error } = validateProduct({ name, price, category, stock, description });
        if (error) {
            return res.status(400).send(error.message); // Send validation error
        }

        // Find or create the category
        let isCategory = await categoryModel.findOne({ name: category });
        if (!isCategory) {
            isCategory = await categoryModel.create({ name: category });
        }

        // Create a new product using the category's ObjectId
        await productModel.create({
            name,
            price,
            category: isCategory._id, // Use the ObjectId from the category document
            stock,
            description,
            image: req.file ? req.file.buffer : null  // Save the image buffer if it exists
        });

        // Redirect after successful product creation
        res.redirect(`/admin/dashboard`);

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
});

router.get('/delete/:id', validateAdmin, async function (req, res) {
    try {
        if(!req.user.admin){
            return res.status(403).json({ message: 'Forbidden: Only admin users can delete products' });  // Send a forbidden response if not admin user
        }
        // Find the product by ID and delete it
        let deletedProd = await productModel.findByIdAndDelete(req.params.id);

        // Check if the product exists
        if (!deletedProd) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Redirect or send a success response
        res.redirect('/admin/products');  // Assuming this is where you want to redirect
        // Alternatively, you could send a success message:
        // res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
});

router.post('/delete', validateAdmin, async function (req, res) {
    try {
        if(!req.user.admin){
            return res.status(403).json({ message: 'Forbidden: Only admin users can delete products' });  // Send a forbidden response if not admin user
        }
        // Find the product by ID and delete it
        let deletedProd = await productModel.findByIdAndDelete({_id: req.body.product_id});

        // Check if the product exists
        if (!deletedProd) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Redirect or send a success response
        res.redirect('back');  // Assuming this is where you want to redirect
        // Alternatively, you could send a success message:
        // res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
});

module.exports = router;