const express = require("express");
const { signup, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUser, managerAllUser, adminGetSingleUser, adminUpdateOneUserDetails, adminDeleteOneuserDetails , } = require("../controller/userController");
const { isLoggedIn,customRole } = require("../middleware/user");
const router = express.Router()


router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotPassword").post(forgotPassword)
router.route("/password/reset/:token").post(passwordReset)
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails)
router.route("/password/update").post(isLoggedIn, changePassword)
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails)

router.route("/manager/users").get(isLoggedIn, customRole("manager"), managerAllUser)

router.route("/admin/users/:id").get(isLoggedIn, customRole("admin"), adminGetSingleUser)
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser)
router.route("/admin/users/:id").put(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails)
router.route("/admin/users/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOneuserDetails)



module.exports = router;