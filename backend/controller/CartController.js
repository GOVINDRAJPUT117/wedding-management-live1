
import '../connection/dbconfig.js'
import CartModel from "../model/CartModel.js";
import BookingModel from '../model/BookingModel.js';
import APIResponse from "../response/APIResponse.js";


export const addToCart = async (req, res) => {
  try {
    const { userId, name, serviceId, serviceName, price, status = "pending" } = req.body;

    if (!userId || !name || !serviceId || !serviceName || !price) {
      return res.status(400).json(
        new APIResponse(false, null, "All fields are required")
      );
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        name,
        items: [{ serviceId, serviceName, price, status }]
      });
    } else {
      if (!cart.name) cart.name = name;

      const itemIndex = cart.items.findIndex(
        item => item.serviceId.toString() === serviceId
      );

      if (itemIndex > -1) {
        return res.status(400).json(
          new APIResponse(false, null, "Service already in cart")
        );
      }

      cart.items.push({ serviceId, serviceName, price, status });
    }

    const savedCart = await cart.save();

    return res.status(200).json(
      new APIResponse(true, savedCart, "Service added to cart successfully")
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Add to cart failed", err.message)
    );
  }
};


//fetchCart
export const fetchCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await CartModel.findOne({ userId })
      .populate({
        path: "items.serviceId",
        select: "service_name service_description service_price service_image category",
        populate: { path: "category", select: "catName" },
      })
      .populate({ path: "userId", select: "name" });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json(
        new APIResponse(false, null, "Cart is empty")
      );
    }

    return res.status(200).json(
      new APIResponse(true, cart, "Cart fetched successfully")
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Failed to fetch cart", err.message)
    );
  }
};


//fetchPendingBookings
export const fetchPendingBookings = async (req, res) => {
  try {
    const pendingCarts = await CartModel.find({ "items.status": "pending" })
      .populate({
        path: "items.serviceId",
        select: "service_name service_description service_price service_image category",
        populate: { path: "category", select: "catName" },
      })
      .populate({ path: "userId", select: "name" });

    if (!pendingCarts || pendingCarts.length === 0) {
      return res.status(404).json(
        new APIResponse(false, null, "No pending bookings")
      );
    }

    const pendingItems = pendingCarts
      .filter(cart => cart.userId)
      .map(cart => ({
        cartId: cart._id,
        user: cart.userId,
        items: cart.items.filter(item => item.status === "pending"),
      }));

    return res.status(200).json(
      new APIResponse(
        true,
        pendingItems,
        "Pending bookings fetched successfully"
      )
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Failed to fetch pending bookings")
    );
  }
};



//confirmBooking
export const confirmBooking = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "itemId required"
      });
    }

    const cart = await CartModel.findOne({
      "items._id": itemId,
      "items.status": "pending"
    }).populate("userId", "name email");

    if (!cart) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "Item not found in any cart"
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "Item not found in cart items"
      });
    }

    const booking = new BookingModel({
      userId: cart.userId._id,
      name: cart.userId.name,
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      price: item.price,
      status: "confirmed",
      info: Date()
    });

    await booking.save();

    cart.items = cart.items.filter(
      i => i._id.toString() !== itemId
    );

    await cart.save();

    const savedBooking = await booking.populate("userId serviceId");

    return res.status(200).json({
      status: true,
      data: savedBooking,
      message: "Service confirmed and saved to bookings"
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      data: null,
      message: "Failed to confirm service",
      error: err.message
    });
  }
};

//removeCartItem


export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(
        new APIResponse(false, null, "User not authenticated")
      );
    }

    if (!itemId) {
      return res.status(400).json(
        new APIResponse(false, null, "Item ID required")
      );
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json(
        new APIResponse(false, null, "Cart not found")
      );
    }

    const itemExists = cart.items.some(
      item => item._id.toString() === itemId
    );

    if (!itemExists) {
      return res.status(404).json(
        new APIResponse(false, null, "Item not found")
      );
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();

    const totalPrice = cart.items.reduce(
      (total, item) => total + Number(item.price || 0),
      0
    );

    return res.status(200).json(
      new APIResponse(
        true,
        {
          cart,
          totalPrice,
          totalServices: cart.items.length
        },
        "Item removed successfully"
      )
    );

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);

    return res.status(500).json(
      new APIResponse(
        false,
        null,
        "Failed to remove item",
        err.message
      )
    );
  }
};
