const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

const signToken = (id) =>
  // inputs: id, secret_phrase, expires_in
  // output: token
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  const { name, email, password } = req.body;

  // 1) checking if email and password were sent
  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password", 400));
  }

  // 2) checking if user with this email already exist
  var response = await supabase
    .from("users")
    .select("email")
    .eq("email", email);

  if (response.data.length > 0) {
    return next(new AppError("User with this email already exits", 400));
  }

  var response = await supabase
    .from("users")
    .insert({
      name: name,
      email: email,
      password: password,
    })
    .select("id");

  var newUserId = response.data[0].id;

  // return if error occured
  if (response.status == 400) {
    res.status(400).json({
      status: "Error occured while creating user",
    });
    return;
  }

  // create auth token
  const token = signToken(newUserId);

  res.status(201).json({
    status: "success",
    userId: newUserId,
    token: token,
  });

  // also create a new cart with user id
  await supabase.from("carts").insert({
    userId: newUserId,
  });
});

exports.validateTokenStatus = catchAsync(async (req, res, next) => {
  const supabase = req.supabase;
  let token = "";

  // 1) checking for token
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Auth token not found. You are not authorized.", 401)
    );
  }

  // 2) decoding token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // token gives user id after decooded
  // 3) checking if user exists with this id
  var doesUserExist = await supabase
    .from("users")
    .select("id")
    .eq("id", decodedToken.id)
    .then((data) => {
      if (data.data.length > 0) {
        return true;
      } else {
        return false;
      }
    });

  if (!doesUserExist) {
    return next(new AppError("User of this token no longer exists", 401));
  }

  req.userId = decodedToken.id;
  next();
});
