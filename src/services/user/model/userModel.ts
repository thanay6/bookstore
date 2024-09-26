import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the attributes for the User model
interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  secret: any; // JSON data, use 'any' or a more specific type if you have a schema
  twoFactor: boolean; // Changed to 'boolean'
  issuiedBooks: string[]; // Array of strings for issued books
  qrURL: string;
}

// Define the optional attributes interface for the model
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Extending Model with UserAttributes and UserCreationAttributes
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

// Define the User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public secret!: any; // Define the JSON data
  public twoFactor!: boolean;
  public issuiedBooks!: string[]; // Array of issued books (string type)
  public qrURL!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const UserModel = (sequelize: Sequelize): typeof User => {
  User.init(
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
      secret: {
        type: DataTypes.JSON, // Use DataTypes.JSONB for PostgreSQL; DataTypes.JSON for MySQL and SQLite
        allowNull: false,
      },
      twoFactor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      issuiedBooks: {
        type: DataTypes.JSON, // Storing array as JSON for cross-database compatibility
        allowNull: true,
      },
      qrURL: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      freezeTableName: true,
      timestamps: true, // Ensures Sequelize manages createdAt and updatedAt fields
    }
  );

  return User;
};

export default UserModel;
