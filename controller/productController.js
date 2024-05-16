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
        status: "error",
      });
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const { name, description, price, category } = req.body;
  
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
        status: "created",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error occured while inserting product",
      });
    });
});
