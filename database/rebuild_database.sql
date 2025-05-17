CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(255) NOT NULL,
    account_lastname VARCHAR(255) NOT NULL,
    account_email VARCHAR(255) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'
);

CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(255) NOT NULL,
    inv_model VARCHAR(255) NOT NULL,
    inv_year CHAR(4) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    inv_price DECIMAL(10, 2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    classification_id INTEGER NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification (classification_id)
);

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');