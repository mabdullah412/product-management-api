const createClient = require('@supabase/supabase-js').createClient;
const express = require('express');
const dotenv = require('dotenv');

const supabaseMiddleware = require('./utilities/supabaseMiddleware');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const port = process.env.PORT || 3000;
const app = express();

// loading enviroment variables from file to process.env 
dotenv.config({path: './config.env'});

// middleware to parse incoming json data
app.use(express.json());

// connecting to supabase database
const supabaseUrl = 'https://stjpdrhuqnrglyuomhnq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// attach supabase client to every incoming req
app.use(supabaseMiddleware(supabase));  

// routers
app.use('/products', productRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}.`);
});
