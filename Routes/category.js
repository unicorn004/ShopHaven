const express = require('express');
const router = express.Router();
const { categoryModel, validateCategory } = require('../models/category');
const {validateAdmin} = require('../middlewares/admin');

router.post('/create',validateAdmin, async function(req, res){
    await categoryModel.create({
        name: req.body.name,
    });
    res.redirect(req.get('Referrer') || '/');

});

module.exports = router;
