import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "OTP",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("password_reset"),
        defaultValue: "password_reset",
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "otps",
      timestamps: true,
    }
  );
