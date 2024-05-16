const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getOrderData = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const userId = req.userId;
  const orderId = req.query.orderId;

  // get order_items
  var orderItemsResponse = await supabase
    .from("order_items")
    .select("productId, quantity");

  await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .then((data) => {
      res.status(200).json({
        status: "success",
        userId: userId,
        orderId: orderId,
        total_cost: data.data[0].total_cost,
        createdAt: data.data[0].created_at,
        products: orderItemsResponse.data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Error occured while placing order",
      });
    });
});

exports.placeOrder = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const userId = req.userId;

  // 1) get cartId for user
  var response = await supabase.from("carts").select("id").eq("userId", userId);
  var cartId = response.data[0].id;

  // 2) check if there are items in cart
  var cartItems = await supabase
    .from("cart_items")
    .select("id, productId, quantity")
    .eq("cartId", cartId);

  if (cartItems.data.length == 0) {
    return next(new AppError("There are no items in cart", 404));
  }

  // retrieve all product ids from productsInCart
  const productIds = [];
  cartItems.data.forEach((item) => {
    productIds.push(item.productId);
  });

  // get prices of products in cart
  var productsPrices = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  // calculate totalPrice by multiplying prices with quantity
  var total_cost = 0;
  for (let i = 0; i < cartItems.data.length; i++) {
    let itemId = cartItems.data[i].productId;
    let quantity = cartItems.data[i].quantity;
    let price = productsPrices.data.find((item) => item.id == itemId).price;
    total_cost += price * quantity;
  }

  // retrieve all cart_item ids from productsInCart to delete them
  const cartItemIds = [];
  cartItems.data.forEach((item) => {
    cartItemIds.push(item.id);
  });

  // remove cart_items
  var response = await supabase
    .from("cart_items")
    .delete()
    .in("id", cartItemIds);

  // create order
  var createOrderResponse = await supabase
    .from("orders")
    .insert({
      userId: userId,
      total_cost: total_cost,
    })
    .select("id");

  // add orderId to every item productsInCart array, so we can push it to order_items
  // also delete the id if the cart_item, a new id will be given for each order_item
  for (let i = 0; i < cartItems.data.length; i++) {
    delete cartItems.data[i]["id"];
    cartItems.data[i]["orderId"] = createOrderResponse.data[0].id;
  }

  // create order_items
  var response = await supabase
    .from("order_items")
    .insert(cartItems.data)
    .select("productId, quantity")
    .then((data) => {
      res.status(200).json({
        status: "success",
        orderId: createOrderResponse.data[0].id,
        total_cost: total_cost,
        products: data.data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Error occured while placing order",
      });
    });
});
