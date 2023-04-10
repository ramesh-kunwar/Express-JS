const Product = require("../model/product")
const BigPromise = require("../middleware/bigPromise")
const CustomError = require("../utils/customError")
const WhereClause = require("../utils/whereClause")

const cloudinary = require("cloudinary").v2



exports.addProduct = BigPromise(async (req, res, next) => {
    // images
    let imageArray = []

    if (!req.files) {
        return next(new CustomError("Images are required", 401))
    }

    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products"
            })

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })

        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(200).json({
        success: true,
        product
    })
})

exports.getAllProduct = BigPromise(async (req, res, next) => {
    const resultPerPage = 6;
    const totalProductCount = await Product.countDocuments;

    const productsObj = new WhereClause(Product.find(), req.query).search().filter()

    let products = productsObj.base.clone()

    const filteredProductNumber = products.length;


    productsObj.pager(resultPerPage)
    products = await productsObj.base

    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        totalProductCount,

    })
})


exports.getSingleProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new CustomError("Products not found in db.", 401))
    }

    res.status(200).json({
        success: true,
        product
    })
})


exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
    const products = await Product.find()

    if (!products) {
        return next(new CustomError("Products not found in db.", 401))
    }

    res.status(200).json({
        success: true,
        products
    })
})


exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
    let imagesArray = []

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new CustomError("Product not found in db.", 401))
    }


    if (req.files) {
        // 1.  destroy the existing images
        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.uploader.destroy(product.photos[index].id);
        }

        // 2. upload and save the images

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products"
            })

            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })

        }
    }


    req.body.photos = imagesArray;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        product
    })
})

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new CustomError("Product not found in db.", 401))
    }


    if (req.files) {
        // 1.  destroy the existing images
        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.uploader.destroy(product.photos[index].id);
        }
    }


    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: "Product delted",
        product
    })

})


exports.addReview = BigPromise(async (req, res, next) => {
    // extract all the information from body

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    // check if user already reviewed the product
    const alreadyReview = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (alreadyReview) {
        //update the review
        product.reviews.forEach((review) => {
            if (reviews.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating
            }
        })

    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    // adjust ratings
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.review.length

    // save
    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})


exports.deleteReview = BigPromise(async (req, res, next) => {
    const { productId } = req.query;

    const product = await Product.findById(productId)

    const reviews = product.reviews.filter((rev) => user.toString() === req.user._id.toString())

    const numberOfReviews = reviews.length;


    // adjust ratings
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // update the product

    await Product.findByIdAndUpdate(productId, {
        reviews,
        ratings,
        numberOfReviews,
    }, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        product
    })
})

exports.getOnlyReviewsForOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        product
    })
})