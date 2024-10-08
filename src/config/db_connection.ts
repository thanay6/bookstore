import { Sequelize } from "sequelize";
import initAdminModel from "../services/admin/model/adminModule";
import initBookModel from "../services/books/model/bookModel";
import initUserModel from "../services/user/model/userModel";
import initCartModel from "../services/cart/model/cartModel";
import initOrderModel from "../services/order/model/orderModel";
import initPaymentModel from "../services/payments/model/paymentModel";

console.log(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  process.env.DB_HOST
);

const connection = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    logging: false,
  }
);

connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error: Error) => {
    console.error("Unable to connect to the database: ", error);
  });

const db = {
  Sequelize,
  connection,
  Admin: initAdminModel(connection),
  Book: initBookModel(connection),
  User: initUserModel(connection),
  Cart: initCartModel(connection),
  Order: initOrderModel(connection),
  Payment: initPaymentModel(connection),
};

// connection
//   .sync({ alter: true })
//   .then(() => console.log("Database tables synced."))
//   .catch((error: unknown) => console.error("Error syncing database:", error));

export default db;
