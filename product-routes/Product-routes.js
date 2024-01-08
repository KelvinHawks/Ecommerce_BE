const express = require("express");
const fileUpload = require("../middlewares/file-upload");
const router = express.Router();
//const checkAuth = require("../middlewares/check-auth");
const mongoPractice = require("../product-controlers/mongoose");

router.get("/products", mongoPractice.getProducts);
router.get("/:pid", mongoPractice.getProductById);
//router.use(checkAuth);
router.post(
  "/products",
  fileUpload.single("image"),
  mongoPractice.createProduct
);

router.patch("/:pid", mongoPractice.editProduct);

router.delete("/:pid", mongoPractice.deleteProduct);

module.exports = router;
