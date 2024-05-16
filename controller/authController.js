const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

const signToken = (email) =>
  // inputs: email, secret_phrase, expires_in
  // output: token
  jwt.sign({ email }, process.env.JWT_SECRET, {
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
  var doesUserExist = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .then((data) => {
      if (data.data.length > 0) {
        return true;
      } else {
        return false;
      }
    });

  if (doesUserExist) {
    return next(new AppError("User with this email already exits", 400));
  }

  await supabase
    .from("users")
    .insert({
      name: name,
      email: email,
      password: password,
    })
    .then((data) => {
      // create jwt token
      const token = signToken(email);

      res.status(201).json({
        status: "success",
        name: name,
        token: token,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error occured while creating user",
      });
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
      new AppError("Auth token not found. You are Unauthorized.", 401)
    );
  }

  // 2) decoding token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // token gives user email after decooded
  // 3) checking if user exists with this email
  var doesUserExist = await supabase
    .from("users")
    .select("email")
    .eq("email", decodedToken.id)
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

  next();
});
