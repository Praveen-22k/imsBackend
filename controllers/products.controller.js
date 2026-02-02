import productModel from "../models/product.model.js";
import Apperror from "../utils/Apperror.js";

const addProduct = async (req, res, next) => {
  try {
    const {
      productPrice,
      productName,
      productStock,
      category,
      productDescription,
    } = req.body;

    if (
      !productName ||
      !productPrice ||
      !productStock ||
      !category ||
      !productDescription
    ) {
      return next(new Apperror("All fields are required", 400));
    }

    if (!req.file) {
      return next(new Apperror("Product image is required", 400));
    }

    const existingproducts = await productModel.findOne({ productName });
    if (existingproducts) {
      return next(new Apperror("This Product Already Exists", 400));
    }

    const newproduct = new productModel({
      productPrice,
      productName,
      productStock,
      category,
      productDescription,
      image: req.file.filename,
    });

    await newproduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newproduct,
    });
  } catch (err) {
    console.log(err);
    return next(new Apperror("Server Error", 500));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const response = await productModel.find().populate("category");
    return res.status(201).json({
      success: true,
      message: "Data fetch Successfully",
      data: response,
    });
  } catch (err) {
    console.log(err);
    return next(new Apperror("Server Error", 500));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingproducts = await productModel.findById(id);
    if (!existingproducts) {
      return next(new Apperror("Product not Found", 404));
    }
    await productModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in DeleteProduct:", err);
    return next(new Apperror("Server Error"));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingproducts = await productModel.findById(id);
    if (!existingproducts) {
      return next(new Apperror("Product not Found", 404));
    }

    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedProduct = await productModel
      .findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      })
      .populate("category");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    return next(new Apperror("Server Error", 500));
  }
};

export { addProduct, getProduct, deleteProduct, updateProduct };
