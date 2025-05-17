-- Query 1: Insert Tony Stark record WORKS
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: Update Tony Stark's account type to Admin WORKS
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Query 3: Delete Tony Stark record WORKS
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Query 4: Update GM Hummer description WORKS
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Select Sport category vehicles with JOIN WORKS
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Query 6: Update image and thumbnail paths WORKS
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');