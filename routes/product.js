const express = require("express");
const { isLoggedIn, customRole } = require("../middleware/user");
const { testProduct, addProduct, getAllProduct, adminGetAllProducts, getSingleProduct, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview, getOnlyReviewsForOneProduct } = require("../controller/productController");
const router = express.Router()


// admin routes
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct)
router.route("/admin/products").get(isLoggedIn, customRole("admin"), adminGetAllProducts)
router.route("/admin/product/:id").put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
router.route("/admin/product/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct)

// user routes
router.route("/products").get(getAllProduct)
router.route("/product/:id").get(getSingleProduct)
router.route("/review").put(addReview)
router.route("/review").delete(deleteReview)
router.route("/reviews").get(getOnlyReviewsForOneProduct)


module.exports = router;