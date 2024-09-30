import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the PaymentAttributes interface
interface PaymentAttributes {
  id: string; // Unique identifier for the payment
  orderId: number; // Unique order ID
  customerId: number; // Unique identifier for the customer placing the order
  totalAmount: number; // Total cost of the order, including taxes and shipping fees
  createdAt?: Date; // Timestamp when the order was created
  updatedAt?: Date; // Timestamp when the order was last updated
}

// Define the optional attributes interface for the model
interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

// Extending Model with PaymentAttributes and PaymentCreationAttributes
export interface PaymentInstance
  extends Model<PaymentAttributes, PaymentCreationAttributes>,
    PaymentAttributes {}

// Define the Payment model class
class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: string; // Unique identifier for the payment
  public orderId!: number; // Unique order ID
  public customerId!: number; // Unique identifier for the customer
  public totalAmount!: number; // Total cost of the order

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const PaymentModel = (sequelize: Sequelize): typeof Payment => {
  Payment.init(
    {
      id: {
        type: DataTypes.STRING, // Changed to string for UUID or custom identifier
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER.UNSIGNED, // Unique order ID
        allowNull: false,
        references: {
          model: "orders", // Assuming you have an 'orders' table
          key: "id",
        },
      },
      customerId: {
        type: DataTypes.INTEGER.UNSIGNED, // Unique identifier for the customer
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2), // Total cost of the order
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "payments",
      freezeTableName: true,
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return Payment;
};

export default PaymentModel;
