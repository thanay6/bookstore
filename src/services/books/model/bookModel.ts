import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the attributes for the Book model
interface BookAttributes {
  id?: string;
  prefix: string; // Changed from PrefixEnum to string
  bookname: string;
  genre: string;
  publisher: string;
  photo: string;
  isbnNumber: string;
  author: string;
  pages: number;
  price: number;
  weight: number;
  country: string;
  series: "yes" | "no" | null; // Use 'yes' or 'no', or null if not applicable
  netQuantity: number;
}

// Define the optional attributes interface for the model
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

// Extending Model with BookAttributes and BookCreationAttributes
export interface BookInstance
  extends Model<BookAttributes, BookCreationAttributes>,
    BookAttributes {}

// Define the Book model class
class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: string;
  public bookname!: string;
  public prefix!: string; // Changed from PrefixEnum to string
  public genre!: string;
  public publisher!: string;
  public photo!: string;
  public isbnNumber!: string;
  public author!: string;
  public pages!: number;
  public price!: number;
  public weight!: number;
  public country!: string;
  public series!: "yes" | "no" | null; // Series can be 'yes', 'no', or null
  public netQuantity!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the model initialization function
const BookModel = (sequelize: Sequelize): typeof Book => {
  Book.init(
    {
      id: {
        type: DataTypes.STRING(128),
        primaryKey: true,
      },
      prefix: {
        type: DataTypes.STRING(128), // Changed to STRING
        allowNull: false,
      },
      bookname: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      publisher: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      isbnNumber: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true, // Ensure ISBN number is unique
      },
      author: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      series: {
        type: DataTypes.ENUM("yes", "no"), // ENUM type with 'yes' or 'no'
        allowNull: true, // Allow null if not applicable
      },
      netQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize, // Use the Sequelize instance from db_connections
      tableName: "books",
      freezeTableName: true,
      timestamps: true, // Ensures Sequelize manages createdAt and updatedAt fields
    }
  );

  return Book;
};

export default BookModel;
