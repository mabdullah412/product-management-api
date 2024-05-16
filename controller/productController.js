const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;

  await supabase
    .from("products")
    .select("*")
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data.data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Error occured while retrieving data",
      });
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const { productId } = req.body;

  // 1) checking if requried data was sent
  if (!productId) {
    return next(new AppError("Please provide a productId", 400));
  }

  // 2) checking if product with this id exist
  var response = await supabase
    .from("products")
    .select("*")
    .eq("id", productId);
  if (response.data.length == 0) {
    return next(new AppError("Product with this id does not exist", 404));
  }

  await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .then((data) => {
      res.status(204).json({
        status: "success",
        message: "product removed successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "error occured while removing product",
      });
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const { productId, name, description, price, category } = req.body;

  // 1) checking if requried data was sent
  if (!productId) {
    return next(new AppError("Product Id not found", 401));
  }

  // 2) checking if product with this id exist
  var response = await supabase
    .from("products")
    .select("*")
    .eq("id", productId);
  if (response.data.length == 0) {
    return next(new AppError("Product with this id does not exist", 404));
  }

  const updateData = {};

  if (name) {
    updateData["name"] = name;
  }
  if (description) {
    updateData["description"] = description;
  }
  if (price) {
    updateData["price"] = price;
  }
  if (category) {
    updateData["category"] = category;
  }

  await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .then((data) => {
      res.status(200).json({
        status: "success",
        message: "Data updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Error occured while updating product",
      });
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const { name, description, price, category } = req.body;

  // 1) checking if requried data was sent
  if (!name || !description || !price || !category) {
    return next(
      new AppError("Please provide name, description, price and category", 400)
    );
  }

  await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      price: price,
      category: category,
    })
    .then((data) => {
      res.status(201).json({
        status: "success",
        message: "product created successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "error occured while inserting product",
      });
    });
});
