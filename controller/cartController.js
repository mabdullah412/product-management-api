const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getCartItems = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const userId = req.userId;

  // 1) get cardId for user
  var response = await supabase.from("carts").select("id").eq("userId", userId);
  var cartId = response.data[0].id;

  await supabase
    .from("cart_items")
    .select("productId, quantity")
    .eq("cartId", cartId)
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data.data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "Error occured while fetching cart data",
      });
    });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const userId = req.userId;
  const { productId } = req.body;

  // 1) get cardId for user
  var response = await supabase.from("carts").select("id").eq("userId", userId);
  var cartId = response.data[0].id;

  // 2) checking if product with this id exist
  var response = await supabase
    .from("products")
    .select("*")
    .eq("id", productId);
  if (response.data.length == 0) {
    return next(new AppError("Product with this id does not exist", 400));
  }

  // 3) checking if product with this id is in cart
  var response = await supabase
    .from("cart_items")
    .select("*")
    .eq("cartId", cartId)
    .eq("productId", productId);
  if (response.data.length == 0) {
    return next(new AppError("This product is not in cart", 400));
  }

  await supabase
    .from("cart_items")
    .delete()
    .eq("cartId", cartId)
    .eq("productId", productId)
    .then((data) => {
      res.status(200).json({
        status: "Item successfully removed from cart",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "Error occured while removing item from cart",
      });
    });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const userId = req.userId;
  const { productId, quantity } = req.body;

  // 1) checking if requried data was sent
  if (!productId || !quantity) {
    return next(
      new AppError("Please provide userId, productId and quantity", 400)
    );
  }

  // 2) checking if product with this id exist
  var response = await supabase
    .from("products")
    .select("*")
    .eq("id", productId);
  if (response.data.length == 0) {
    return next(new AppError("Product with this id does not exist", 400));
  }

  // 3) get cardId for user
  var response = await supabase.from("carts").select("id").eq("userId", userId);
  var cartId = response.data[0].id;

  // 4) check if this product is already in cart, if yes, then add to quantity
  var response = await supabase
    .from("cart_items")
    .select("*")
    .eq("cartId", cartId)
    .eq("productId", productId);

  // product is not in cart, then add
  if (response.data.length == 0) {
    await supabase
      .from("cart_items")
      .insert({
        cartId: cartId,
        productId: productId,
        quantity: quantity,
      })
      .then((data) => {
        res.status(200).json({
          status: "Item added to cart successfully",
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: "Error occured while adding item to cart",
        });
      });
  }
  // product is already in cart, add to quantity
  else {
    await supabase
      .from("cart_items")
      .update({
        quantity: response.data[0].quantity + quantity,
      })
      .eq("cartId", cartId)
      .eq("productId", productId)
      .then((data) => {
        res.status(200).json({
          status: "Item added to cart successfully",
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: "Error occured while adding item to cart",
        });
      });
  }
});
