import { createClient } from '@supabase/supabase-js';
import express from "express";
import dotenv from "dotenv";

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

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}.`);
});