import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import "./config/db_connection";

//routers

import userRoute from "./services/admin/routers/userRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//routers

app.use("/api", userRoute);

app.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
