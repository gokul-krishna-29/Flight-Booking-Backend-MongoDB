const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// mongoose.connect("mongodb://localhost:27017/airline", {
mongoose.connect("mongodb://127.0.0.1:27017/airline", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb connected");
});
connection.on("error", (error) => {
  console.log("MongoDB connection error:", error);
});

app.use(cors());
app.use(express.json());

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

data = {
  msg: "Welcome",
  info: "This is a root endpoint",
};
app.route("/").get((req, res) => res.json(data));

app.listen(port, () => {
  console.log(`App connected in port ${port}`);
});
