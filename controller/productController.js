const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;

  await supabase
    .from("products")
    .select("*")
    .then((data) => {
      console.log("Product retrieved!", data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error("Error retrieving product:", error);
      res.status(200).json({
        status: "error",
      });
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const productData = req.query;
  const supabase = req.supabase;

  await supabase
    .from("products")
    .insert(productData)
    .then((data) => {
      console.log("Product inserted successfully!", data);
      res.status(200).json({
        status: "created",
      });
    })
    .catch((error) => {
      console.error("Error inserting product:", error);
      res.status(201).json({
        status: "created",
      });
    });

});
