const User = require("../models/User");
const Booking = require("../models/Booking");

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const pendingBookings = await Booking.countDocuments({ status: "Pending" });

    res.json({
      userCount,
      pendingBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a provider
// @route   PUT /api/admin/approve-provider/:id
// @access  Private/Admin
const approveProvider = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);

    if (provider && provider.role === "provider") {
      provider.isApproved = true;
      const updatedProvider = await provider.save();
      res.json(updatedProvider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  approveProvider,
};
// backend/controllers/adminController.js

const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const asyncHandler = require("express-async-handler");
const { filter } = require("../utils/filter");

// @desc   Get dashboard statistics
// @route  GET /api/admin/dashboard
// @access Private (Admin only)
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingProviders = await User.countDocuments({
      role: "provider",
      isApproved: false,
    });
    const pendingBookings = await Booking.countDocuments({ status: "Pending" });

    // Calculate total revenue from completed bookings
    const completedBookings = await Booking.find({
      status: "Completed",
    }).populate("service");
    let totalRevenue = 0;
    completedBookings.forEach((booking) => {
      totalRevenue += booking.service.price;
    });

    res.status(200).json({
      totalUsers,
      pendingProviders,
      pendingBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve dashboard statistics" });
  }
});

// @desc   Get all users with filtering, sorting, and pagination
// @route  GET /api/admin/users
// @access Private (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Filtering options
    const { role, sortBy, page = 1, limit = 10 } = req.query;

    // Build query object based on filters
    const query = {};
    if (role) {
      query.role = role;
    }

    // Sorting options
    const sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    }

    // Pagination options
    const skip = (page - 1) * limit;

    // Execute query
    const users = await User.find(query).sort(sort).skip(skip).limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});

// @desc   Get user details by ID
// @route  GET /api/admin/users/:id
// @access Private (Admin only)
const getUserDetails = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user details" });
  }
});

// @desc   Update user role and/or status
// @route  PUT /api/admin/users/:id
// @access Private (Admin only)
const updateUserRoleAndStatus = asyncHandler(async (req, res) => {
  try {
    const { role, isApproved } = req.body; // Only allow updating role and isApproved
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isApproved }, // Only update provided fields
      { new: true, runValidators: true } // Return updated user and validate
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
// @access Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ---------------------- SERVICE MANAGEMENT ----------------------
// These methods might already be in serviceController.js, in that case, protect them with roleMiddleware('admin')
// If not, you can add them here, but it's better to keep service-related logic in serviceController

// @desc   Create a new service
// @route  POST /api/admin/services
// @access Private (Admin only)
const createService = asyncHandler(async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
});

// @desc   Update an existing service
// @route  PUT /api/admin/services/:id
// @access Private (Admin only)
const updateService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
});

// @desc   Delete a service
// @route  DELETE /api/admin/services/:id
// @access Private (Admin only)
const deleteService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
});

// ---------------------- BOOKING MANAGEMENT ----------------------

// @desc   Get all bookings with filtering, sorting, and pagination
// @route  GET /api/admin/bookings
// @access Private (Admin only)
const getAllBookings = asyncHandler(async (req, res) => {
  try {
    // Filtering options
    const { status, sortBy, page = 1, limit = 10 } = req.query;

    // Build query object based on filters
    const query = {};
    if (status) {
      query.status = status;
    }

    // Sorting options
    const sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    }

    // Pagination options
    const skip = (page - 1) * limit;

    // Execute query
    const bookings = await Booking.find(query)
      .populate("user", "name email") // Populate user details
      .populate("service", "name price") // Populate service details
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      totalBookings,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
});

// @desc   Get booking details by ID
// @route  GET /api/admin/bookings/:id
// @access Private (Admin only)
const getBookingDetails = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email") // Populate user details
      .populate("service", "name price"); // Populate service details

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve booking details" });
  }
});

// @desc   Update booking status
// @route  PUT /api/admin/bookings/:id
// @access Private (Admin only)
const updateBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email") // Populate user details
      .populate("service", "name price"); // Populate service details

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRoleAndStatus,
  deleteUser,
  createService, // If not in serviceController
  updateService, // If not in serviceController
  deleteService, // If not in serviceController
  getAllBookings,
  getBookingDetails,
  updateBookingStatus,
};
