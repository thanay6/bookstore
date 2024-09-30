import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import "./config/db_connection";

//routers

import adminRoute from "./services/admin/routers/userRouter";
import bookRoute from "./services/books/routers/bookRouter";
import userRoute from "./services/user/routers/userRouter";
import cartRoute from "./services/cart/routers/cartRouter";
import orderRoute from "./services/order/routers/orderRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//routers

app.use("/api", adminRoute);
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

app.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
