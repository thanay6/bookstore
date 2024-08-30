import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the attributes for the Admin model
interface AdminAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: "owner" | "manager"; // Restrict role to 'owner' or 'manager'
  secret: any; // JSON data, use 'any' or a more specific type if you have a schema
  twoFactor: Boolean;
}

// Define the optional attributes interface for the model
interface AdminCreationAttributes extends Optional<AdminAttributes, "id"> {}

// Extending Model with AdminAttributes and AdminCreationAttributes
export interface AdminInstance
  extends Model<AdminAttributes, AdminCreationAttributes>,
    AdminAttributes {}

// Define the Admin model class
class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: "owner" | "manager"; // Restrict role to 'owner' or 'manager'
  public secret!: any; // Define the JSON data
  public twoFactor!: boolean; // Use 'boolean' instead of 'Boolean'

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const AdminModel = (sequelize: Sequelize): typeof Admin => {
  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("owner", "manager"), // Restrict role to 'owner' or 'manager'
        allowNull: false,
      },
      secret: {
        type: DataTypes.JSON, // Use DataTypes.JSONB for PostgreSQL; DataTypes.JSON for MySQL and SQLite
        allowNull: false,
      },
      twoFactor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize, // Use the Sequelize instance from db_connections
      tableName: "admins",
      freezeTableName: true,
      timestamps: true, // Ensures Sequelize manages createdAt and updatedAt fields
    }
  );

  return Admin;
};

export default AdminModel;
