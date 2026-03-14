import sequelize from "../db/database.js";

// ── Import models ────────────────────────────────────────────────────────────
import defineUser         from "./user.model.js";
import defineWarehouse    from "./warehouse.model.js";
import defineLocation     from "./location.model.js";
import defineCategory     from "./category.model.js";
import defineProduct      from "./product.model.js";
import defineStock        from "./stock.model.js";
import defineReceipt      from "./receipt.model.js";
import defineReceiptLine  from "./receiptLine.model.js";
import defineDelivery     from "./delivery.model.js";
import defineDeliveryLine from "./deliveryLine.model.js";
import defineTransfer     from "./transfer.model.js";
import defineTransferLine from "./transferLine.model.js";
import defineAdjustment   from "./adjustment.model.js";
import defineAdjustmentLine from "./adjustmentLine.model.js";
import defineStockLedger  from "./stockLedger.model.js";
import defineOTP          from "./otp.model.js";

const User         = defineUser(sequelize);
const Warehouse    = defineWarehouse(sequelize);
const Location     = defineLocation(sequelize);
const Category     = defineCategory(sequelize);
const Product      = defineProduct(sequelize);
const Stock        = defineStock(sequelize);
const Receipt      = defineReceipt(sequelize);
const ReceiptLine  = defineReceiptLine(sequelize);
const Delivery     = defineDelivery(sequelize);
const DeliveryLine = defineDeliveryLine(sequelize);
const Transfer     = defineTransfer(sequelize);
const TransferLine = defineTransferLine(sequelize);
const Adjustment   = defineAdjustment(sequelize);
const AdjustmentLine = defineAdjustmentLine(sequelize);
const StockLedger  = defineStockLedger(sequelize);
const OTP          = defineOTP(sequelize);

// ── Associations ─────────────────────────────────────────────────────────────

// Warehouse ↔ Location
Warehouse.hasMany(Location, { foreignKey: "warehouseId", as: "locations" });
Location.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });

// Category (self-referencing for sub-categories)
Category.hasMany(Category, { foreignKey: "parentId", as: "subCategories" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

// Category ↔ Product
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Stock (product × location)
Product.hasMany(Stock, { foreignKey: "productId", as: "stocks" });
Stock.belongsTo(Product, { foreignKey: "productId", as: "product" });
Location.hasMany(Stock, { foreignKey: "locationId", as: "stocks" });
Stock.belongsTo(Location, { foreignKey: "locationId", as: "location" });

// Receipt
User.hasMany(Receipt, { foreignKey: "createdBy", as: "receipts" });
Receipt.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Warehouse.hasMany(Receipt, { foreignKey: "warehouseId", as: "receipts" });
Receipt.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
Receipt.hasMany(ReceiptLine, { foreignKey: "receiptId", as: "lines", onDelete: "CASCADE" });
ReceiptLine.belongsTo(Receipt, { foreignKey: "receiptId", as: "receipt" });
ReceiptLine.belongsTo(Product, { foreignKey: "productId", as: "product" });
ReceiptLine.belongsTo(Location, { foreignKey: "locationId", as: "location" });

// Delivery
User.hasMany(Delivery, { foreignKey: "createdBy", as: "deliveries" });
Delivery.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Warehouse.hasMany(Delivery, { foreignKey: "warehouseId", as: "deliveries" });
Delivery.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
Delivery.hasMany(DeliveryLine, { foreignKey: "deliveryId", as: "lines", onDelete: "CASCADE" });
DeliveryLine.belongsTo(Delivery, { foreignKey: "deliveryId", as: "delivery" });
DeliveryLine.belongsTo(Product, { foreignKey: "productId", as: "product" });
DeliveryLine.belongsTo(Location, { foreignKey: "locationId", as: "location" });

// Transfer
User.hasMany(Transfer, { foreignKey: "createdBy", as: "transfers" });
Transfer.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Transfer.hasMany(TransferLine, { foreignKey: "transferId", as: "lines", onDelete: "CASCADE" });
TransferLine.belongsTo(Transfer, { foreignKey: "transferId", as: "transfer" });
TransferLine.belongsTo(Product, { foreignKey: "productId", as: "product" });
TransferLine.belongsTo(Location, { foreignKey: "fromLocationId", as: "fromLocation" });
TransferLine.belongsTo(Location, { foreignKey: "toLocationId", as: "toLocation" });

// Adjustment
User.hasMany(Adjustment, { foreignKey: "createdBy", as: "adjustments" });
Adjustment.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Warehouse.hasMany(Adjustment, { foreignKey: "warehouseId", as: "adjustments" });
Adjustment.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
Adjustment.hasMany(AdjustmentLine, { foreignKey: "adjustmentId", as: "lines", onDelete: "CASCADE" });
AdjustmentLine.belongsTo(Adjustment, { foreignKey: "adjustmentId", as: "adjustment" });
AdjustmentLine.belongsTo(Product, { foreignKey: "productId", as: "product" });
AdjustmentLine.belongsTo(Location, { foreignKey: "locationId", as: "location" });

// Stock Ledger
StockLedger.belongsTo(Product, { foreignKey: "productId", as: "product" });
StockLedger.belongsTo(Location, { foreignKey: "locationId", as: "location" });
StockLedger.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
StockLedger.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// OTP
OTP.belongsTo(User, { foreignKey: "userId", as: "user" });

export {
  sequelize,
  User,
  Warehouse,
  Location,
  Category,
  Product,
  Stock,
  Receipt,
  ReceiptLine,
  Delivery,
  DeliveryLine,
  Transfer,
  TransferLine,
  Adjustment,
  AdjustmentLine,
  StockLedger,
  OTP,
};
