import category from "../models/Category.model.js";
import Apperror from "../utils/Apperror.js";

const addCategory = async (req, res, next) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    const existingcategory = await category.findOne({ categoryName });
    if (existingcategory) {
      return next(new Apperror("Category already exists", 400));
    }

    const newcategory = new category({
      categoryName,
      categoryDescription,
    });

    await newcategory.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newcategory,
    });
  } catch (err) {
    console.log("Error adding category:", err);
    return next(new Apperror("Server error", 500));
  }
};

const getCategories = async (req, res, next) => {
  try {
    const response = await category.find();
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

    const existingCategory = await category.findById(id);
    if (!existingCategory) {
      return next(new Apperror("Category not found", 404));
    }

    await category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.log("Error in deleting category:", err);
    return next(new Apperror("Server error", 500));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;

    const existingCategory = await category.findById(id);
    if (!existingCategory) {
      return next(new Apperror("No Category Found", 500));
    }

    const updateCategory = await category.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
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

export { addCategory, getCategories, deleteCategory, updateCategory };
