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
  public userId!: number; // Ensure this is included
  public productId!: string;
  public quantity!: number;
  public price!: number;
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
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "carts",
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Cart;
};

export default CartModel;
