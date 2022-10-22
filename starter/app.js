require("dotenv").config();
require("express-async-errors");

//async errors

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRoutes = require("./routes/products");

const notFoundmiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

//middlware

app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send(
    `<h1>Store Api</h1> <a href = "/api/v1/products">Products routes</a>`
  );
});

app.use("/api/v1/products", productsRoutes);

//prodcuts route

app.use(notFoundmiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connect DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
