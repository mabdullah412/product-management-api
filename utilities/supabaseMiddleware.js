function supabaseMiddleware(supabase) { // Receive Supabase from app.js
  return (req, res, next) => {
    req.supabase = supabase; // Attach Supabase to request object
    next();
  };
}

module.exports = supabaseMiddleware;
