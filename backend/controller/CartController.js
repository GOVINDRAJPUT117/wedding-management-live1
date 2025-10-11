import '../connection/dbconfig.js'
import CartModel from "../model/CartModel.js";
import BookingModel from '../model/BookingModel.js';
import APIResponse from "../response/APIResponse.js";

export const addToCart = async (req, res) => {
  try {
    console.log("===== Add to Cart API Called =====");

    // 🔹 Frontend se data
    console.log("Frontend se data aa raha hai:", req.body);

    const { userId, name, serviceId, serviceName, price, status = "pending" } = req.body;

    // 🔹 Required fields check
    if (!userId || !name || !serviceId || !serviceName || !price) {
      console.log("Error: Missing required fields");
      return res.status(400).json(new APIResponse(false, null, "All fields are required"));
    }

    console.log("All required fields are present");

    // 🔹 Find existing cart for the user
    let cart = await CartModel.findOne({ userId });
    console.log("Existing cart fetched:", cart);

    if (!cart) {
      console.log("No existing cart, creating a new one...");
      cart = new CartModel({
        userId,
        name, // ✅ set user name
        items: [{ serviceId, serviceName, price, status }]
      });
      console.log("New cart object ready:", cart);
    } else {
      console.log("Cart already exists, checking items...");

      // ✅ Ensure cart has name
      if (!cart.name) cart.name = name;

      // 🔹 Check if service already exists in cart
      const itemIndex = cart.items.findIndex(item => item.serviceId.toString() === serviceId);

      if (itemIndex > -1) {
        console.log("Service already in cart");
        return res.status(400).json(new APIResponse(false, null, "Service already in cart"));
      }

      // 🔹 Add new service item with all required fields
      cart.items.push({ serviceId, serviceName, price, status });
      console.log("New service added to cart:", cart.items);
    }

    // 🔹 Save cart
    const savedCart = await cart.save();
    console.log("Cart saved successfully:", savedCart);

    res.status(200).json(new APIResponse(true, savedCart, "Service added to cart successfully"));
    console.log("===== Add to Cart API Completed =====");
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json(new APIResponse(false, null, "Add to cart failed", err.message));
  }
};



export const fetchCart = async (req, res) => {
  try {
    const userId = req.user._id; // middleware se aaya hua
    console.log("Middleware userId:", userId);

    const cart = await CartModel.findOne({ userId })
      .populate({
        path: "items.serviceId",
        select: "service_name service_description service_price service_image category",
        populate: { path: "category", select: "catName" },
      })
      .populate({ path: "userId", select: "name" });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json(new APIResponse(false, null, "Cart is empty"));
    }

    res.status(200).json(new APIResponse(true, cart, "Cart fetched successfully"));
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json(new APIResponse(false, null, "Failed to fetch cart", err.message));
  }
};


export const fetchPendingBookings = async (req, res) => {
  try {
    console.log("Fetching all carts with at least one pending item...");

    // Fetch all carts having at least one pending item
    const pendingCarts = await CartModel.find({ "items.status": "pending" })
      .populate({
        path: "items.serviceId",
        select: "service_name service_description service_price service_image category",
        populate: { path: "category", select: "catName" },
      })
      .populate({ path: "userId", select: "name" }); // populate user name

    console.log("Raw pending carts from DB:", pendingCarts);

    if (!pendingCarts || pendingCarts.length === 0) {
      console.log("No pending bookings found.");
      return res
        .status(404)
        .json(new APIResponse(false, null, "No pending bookings"));
    }

    // Filter only pending items, add cartId, ensure user exists
    const pendingItems = pendingCarts
      .filter(cart => cart.userId) // Remove any cart where userId is null
      .map(cart => ({
        cartId: cart._id,            // Add cart ID here
        user: cart.userId,           // Populated user object
        items: cart.items.filter(item => item.status === "pending"),
      }));

    console.log("Final pending items to send:", pendingItems);

    res
      .status(200)
      .json(new APIResponse(true, pendingItems, "Pending bookings fetched successfully"));
  } catch (err) {
    console.error("Fetch pending bookings error:", err);
    res
      .status(500)
      .json(new APIResponse(false, null, "Failed to fetch pending bookings"));
  }
};



export const confirmBooking = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("Received itemId:", itemId);

    if (!itemId) {
      return res.status(400).json({ status: false, data: null, message: "itemId required" });
    }

    // Find cart containing the item
    const cart = await CartModel.findOne({ "items._id": itemId, "items.status": "pending" })
                                .populate("userId", "name email");
    console.log("Cart found:", cart);

    if (!cart) {
      return res.status(404).json({ status: false, data: null, message: "Item not found in any cart" });
    }

    const item = cart.items.id(itemId);
    console.log("Item found:", item);

    if (!item) {
      return res.status(404).json({ status: false, data: null, message: "Item not found in cart items" });
    }

    // Create booking
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
    console.log("Booking saved:", booking);

    // Remove item from cart
    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    await cart.save();
    console.log("Item removed from cart");

    const savedBooking = await booking.populate("userId serviceId");
    res.status(200).json({ status: true, data: savedBooking, message: "Service confirmed and saved to bookings" });

  } catch (err) {
    console.error("Confirm booking error:", err);
    res.status(500).json({ status: false, data: null, message: "Failed to confirm service", error: err.message });
  }
};


 

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params; // frontend se items._id milega
    const userId = req.user?._id;

    if (!itemId) {
      return res.status(400).json(new APIResponse(false, null, "Item ID required"));
    }

    // Find cart for logged-in user
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json(new APIResponse(false, null, "Cart not found"));
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();

    // Populate service details for updated cart
    await cart.populate("items.serviceId");

    // Calculate total price & total services
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.serviceId.price || 0),
      0
    );
    const totalServices = cart.items.length;

    res.status(200).json(
      new APIResponse(true, { cart, totalPrice, totalServices }, "Item removed successfully")
    );

  } catch (err) {
    console.error(err);
    res.status(500).json(new APIResponse(false, null, "Failed to remove item"));
  }
};

