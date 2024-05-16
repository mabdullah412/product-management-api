const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;

  await supabase
    .from("products")
    .select("*")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(200).json({
        status: "error occured while retrieving data",
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

  await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .then((data) => {
      res.status(204).json({
        status: "product removed successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error occured while removing product",
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
      res.status(201).json({
        status: "Data updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error occured while updating product",
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
        status: "product created successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error occured while inserting product",
      });
    });
});
