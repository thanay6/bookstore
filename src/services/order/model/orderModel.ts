import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the OrderAttributes interface
interface OrderAttributes {
  id: number; // Unique identifier for the order
  customerId: number; // Unique identifier for the customer placing the order
  paymentMethod: "credit_card" | "paypal" | "bank_transfer" | "cash"; // Method used for payment
  totalAmount: number; // Total cost of the order, including taxes and shipping fees
  trackingNumber?: string; // Optional tracking number provided by the shipping carrier
  createdAt?: Date; // Timestamp when the order was created
  updatedAt?: Date; // Timestamp when the order was last updated
}

// Define the optional attributes interface for the model
interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

// Extending Model with OrderAttributes and OrderCreationAttributes
export interface OrderInstance
  extends Model<OrderAttributes, OrderCreationAttributes>,
    OrderAttributes {}

// Define the Order model class
class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number; // Auto-incremented ID for the order
  public customerId!: number; // Unique identifier for the customer
  public paymentMethod!: "credit_card" | "paypal" | "bank_transfer" | "cash"; // Payment method
  public totalAmount!: number; // Total cost of the order
  public trackingNumber?: string; // Optional tracking number

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const OrderModel = (sequelize: Sequelize): typeof Order => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true, // Auto-incrementing primary key
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.INTEGER.UNSIGNED, // Unique identifier for the customer
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("credit_card", "paypal", "bank_transfer", "cash"), // Payment methods
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2), // Total cost of the order
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING, // Optional tracking number
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "orders",
      freezeTableName: true,
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return Order;
};

export default OrderModel;
