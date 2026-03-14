import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      unitOfMeasure: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "unit",
      },
      description: {
        type: DataTypes.TEXT,
      },
      reorderPoint: {
        // alert when total stock falls below this
        type: DataTypes.DECIMAL(12, 3),
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "products",
      timestamps: true,
      paranoid: true,
    }
  );
