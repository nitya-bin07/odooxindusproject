import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
    }
  );
