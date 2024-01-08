const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const placeRoutes = require("././product-routes/Product-routes");
const userRoutes = require("./users-routes/Users-Routes");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(
  "/uploads/prod-images",
  express.static(path.join("uploads", "prod-images"))
);
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With",
//     "Content-Type, Accept, authorization"
//   );
// });

app.use(cors());
app.use(express.json());

app.use("/api", placeRoutes);
app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5000, () => console.log("App listening on port 5000"));
  })
  .catch((err) => {
    console.log(err);
  });
