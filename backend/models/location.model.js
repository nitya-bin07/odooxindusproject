import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      warehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      type: {
        // internal = shelf/rack, vendor = supplier source, customer = delivery dest
        type: DataTypes.ENUM("internal", "vendor", "customer", "virtual"),
        defaultValue: "internal",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "locations",
      timestamps: true,
      paranoid: true,
      indexes: [
        { unique: true, fields: ["warehouseId", "code"] },
      ],
    }
  );
