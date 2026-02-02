import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Apperror from "../utils/Apperror.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Apperror("User not found", 401));
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return next(new Apperror("Invalid credentials", 401));
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      success: true,
      message: "login successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(new Apperror("Internal Server error", 500));
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new Apperror("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "customer",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(new Apperror(error.message, 500));
  }
};

export { login, signup };
