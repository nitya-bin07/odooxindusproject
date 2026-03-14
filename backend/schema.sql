CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('manager','staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INT,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE warehouses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(200)
);

CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    warehouse_id INT,
    name VARCHAR(120),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

CREATE TABLE inventory_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    location_id INT,
    quantity INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(150),
    warehouse_id INT,
    status ENUM('draft','waiting','ready','done','cancelled'),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE receipt_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE deliveries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(150),
    warehouse_id INT,
    status ENUM('draft','waiting','ready','done','cancelled'),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE delivery_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    delivery_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE transfers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_location INT,
    destination_location INT,
    status ENUM('draft','waiting','ready','done','cancelled'),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_location) REFERENCES locations(id),
    FOREIGN KEY (destination_location) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE transfer_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transfer_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (transfer_id) REFERENCES transfers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE adjustments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    location_id INT,
    adjustment_qty INT,
    reason VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE stock_ledger (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    location_id INT,
    change_qty INT,
    reference_type VARCHAR(50),
    reference_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);