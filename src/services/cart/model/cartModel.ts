import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the CartAttributes interface
interface CartAttributes {
  id: number; // Unique identifier for the cart
  userId: number; // Unique identifier for the user
  productId: string; // Unique identifier for the product
  quantity: number; // Quantity of the product in the cart
  price: number; // Price of the product
  totalAmount: number; // Total cost of all items in the cart
  createdAt?: Date; // Timestamp when the cart was created
  updatedAt?: Date; // Timestamp when the cart was last updated
}

// Define the optional attributes interface for the model
interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

// Extending Model with CartAttributes and CartCreationAttributes
export interface CartInstance
  extends Model<CartAttributes, CartCreationAttributes>,
    CartAttributes {}

// Define the Cart model class
class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;
  public productId!: string; // Unique identifier for the product
  public quantity!: number; // Quantity of the product in the cart
  public price!: number; // Price of the product
  public totalAmount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const CartModel = (sequelize: Sequelize): typeof Cart => {
  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      productId: {
        type: DataTypes.STRING, // Unique identifier for the product
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER, // Quantity of the product in the cart
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // Price of the product
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2), // Total cost of all items in the cart
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "carts",
      freezeTableName: true,
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return Cart;
};

export default CartModel;
