const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "PLease provide product name"],
        trim: true,
        maxlength: [120, "Product name should not be more than 120 characters"],
    },
    price: {
        type: Number,
        required: [true, "PLease provide product price"],
        maxlength: [5, "Product number should not be more than 5 digits"],
    },
    description: {
        type: String,
        required: [true, "PLease provide product description"],
    },
    photos: [
        {
            id: {
                type: String,
                required: true,
            },
            secure_url: {
                type: String,
                required: true,
            },
        }
    ],

    category: {
        type: String,
        required: [true, "PLease select product category from - short-sleeves,long-sleeves, sweat-shirts, hoodies"],
        enum: {
            values: [
                "short-sleeves",
                "long-sleeves",
                "sweat-shirts",
                "hoodies"
            ],
            message: "PLease select  category only from - short-sleeves,long-sleeves, sweat-shirts, hoodies"
        }
    },

    brand: {
        type: String,
        required: [true, "Please add a brand for clothing"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: {
        type: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
            }
        ],
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }


})


module.exports = mongoose.model("Product", productSchema)