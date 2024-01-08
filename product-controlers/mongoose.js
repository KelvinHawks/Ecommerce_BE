let Product = require("../models/product");
const uuid = require("uuid");

const uniqueId = uuid.v4();

const createProduct = async (req, res, next) => {
  const { name, description, color, price, category, company, image } =
    req.body;
  //console.log(name);
  const createdProduct = new Product({
    id: uniqueId,
    name,
    description,
    image,
    color,
    price,
    category,
    company,
  });

  try {
    await createdProduct.save();
  } catch (error) {
    console.log("error2..", error);
  }

  res.status(201).json({ product: createdProduct });
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find().exec();
  } catch (error) {
    console.log("error is", error);
  }

  res.json(products);
};

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    console.log("err...: ", err);
  }

  if (!Product) {
    const error = "Could not find a place for the provided placeId";

    return error;
  }
  res.json(product);
};
const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }
  try {
    await Product.deleteOne(product);
  } catch (error) {
    console.log(error);
  }
  return res.json({ message: `item deleted successfully` });
};

const editProduct = async (req, res, next) => {
  const { name, description, image, price, color, category, company } =
    req.body;
  const productId = req.params.pid;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }
  product.name = name;
  product.description = description;
  product.image = image;
  product.price = price;
  product.color = color;
  product.category = category;
  product.company = company;

  try {
    await product.save();
  } catch (error) {
    console.log(error);
  }
  res.json({ product });
};

exports.createProduct = createProduct;
exports.getProductById = getProductById;
exports.getProducts = getProducts;
exports.deleteProduct = deleteProduct;
exports.editProduct = editProduct;
