const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const {fileSizeFormatter} = require('../utils/fileUpload');
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async(req, res) => {
    const {name, sku, category, quantity, price, description} = req.body;

    // Validation
    if (!name || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Handle image upload
    let fileData = {};

    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,
                {folder: "PInvent-app", resouce_type: "image"}
            )
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size),
        }
    }

    // Create Product 
    const product = await Product.create({
        user: req.user.id,
        name,
        sku, 
        category,
        quantity,
        price,
        description,
        image: fileData
    });

    res.status(201).json(product);
});

const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({user: req.user.id}).sort("-createdAt");

    res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() != req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    res.status(200).json(product);
});

const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() != req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await Product.deleteOne({_id: req.params.id});

    res.status(200).json({message: "Product deleted successfully"});
});

const updateProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const {name, category, price, quantity, description} = req.body;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() != req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;


    await product.save();

    res.status(200).json({message: "Product updated successfully"});
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
};