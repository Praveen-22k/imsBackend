import supplier from "../models/supplier.model.js";
import Apperror from "../utils/Apperror.js";

const addSupplier = async (req, res, next) => {
  try {
    const { supplierName, supplierAddress, supplierEmail, supplierNo } =
      req.body;

    const existingSupplier = await supplier.findOne({ supplierName });
    if (existingSupplier) {
      return next(new Apperror("Supplier already exists", 400));
    }
    const newSupplier = new supplier({
      supplierName,
      supplierAddress,
      supplierEmail,
      supplierNo,
    });
    await newSupplier.save();
    return res.status(201).json({
      success: true,
      message: "Supplier detail added successfully",
      data: newSupplier,
    });
  } catch (err) {
    console.log(err);
    return next(new Apperror("Server Error", 500));
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const response = await supplier.find();
    return res.status(201).json({
      success: true,
      message: "data fetched success",
      data: response,
    });
  } catch (err) {
    console.log("Error in Fetching category:", err);
    return next(new Apperror("Server error", 500));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCategory = await supplier.findById(id);
    if (!existingCategory) {
      return next(new Apperror("Category not found", 404));
    }

    await supplier.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.log("Error deleting category:", err);
    return next(new Apperror("Server error", 500));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { supplierName, supplierAddress, supplierEmail, supplierNo } =
      req.body;

    const existingSupplier = await supplier.findById(id);
    if (!existingSupplier) {
      return next(new Apperror("No Supplier Found", 500));
    }

    const updateCategory = await supplier.findByIdAndUpdate(
      id,
      { supplierName, supplierAddress, supplierEmail, supplierNo },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updateCategory,
    });
  } catch (err) {
    console.log("Error in Update Category", err);
    return next(new Apperror("No Category Found", 500));
  }
};

export { addSupplier, getSupplier, deleteCategory, updateCategory };
