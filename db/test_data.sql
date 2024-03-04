use expense_tracker;

START TRANSACTION;

INSERT INTO USER (USER_FNAME, USER_LNAME, USER_EMAIL, USER_PASSWORD)
VALUES ('Kapil', 'Suryawanshi', 'suryawanshik@uhv.edu', 'kapil123'),
		('Suraj', 'Odera', '2329291@uhv.edu', 'suraj123'),
        ('Shayan', 'Ali', '2244554@uhv.edu', 'shayan123'),
        ('Aradhana', 'Sharma', 'Sharmaa6@uhv.edu', 'aradhana123'),
        ('Amjad', 'Nusayr', 'NusayrA@uhv.edu', 'amjad123');

INSERT INTO CATEGORY (OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION)
	SELECT u.USER_ID, 'Grocery', 'Expenses for food and household items' FROM USER u
	UNION ALL
	SELECT u.USER_ID, 'Utility', 'Monthly bills for utilities' FROM USER u
	UNION ALL
	SELECT u.USER_ID, 'Car', 'Expenses related to car maintenance and fuel' FROM USER u
	UNION ALL
	SELECT u.USER_ID, 'Loan', 'Expenses related to personal or home loans' FROM USER u
	UNION ALL
	SELECT u.USER_ID, 'Insurance', 'Expenses for various insurances' FROM USER u;

INSERT INTO BUDGET (CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES)
	SELECT CATEGORY_ID, '2024-01-01' AS BUDGET_DATE, 100.00 AS BUDGET_AMOUNT, 'Initial budget' AS BUDGET_NOTES
	FROM CATEGORY;

INSERT INTO TRANSACTION (CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES)
	SELECT CATEGORY_ID, 'Expense', '2024-01-01', 55.00, concat(CATEGORY_TITLE, ' expense')
    FROM CATEGORY;

INSERT INTO USER_GROUP (OWNER_ID, USER_GROUP_TITLE, USER_GROUP_DATE, USER_GROUP_DESCRIPTION) VALUES
(1, 'Tech Innovate Summit', '2024-01-01', 'A gathering for showcasing cutting-edge technology innovations.'),
(2, 'Global Entrepreneurs Meet', '2024-01-01', 'Networking and knowledge exchange for entrepreneurs from around the globe.'),
(3, 'Art & Culture Fest', '2024-01-01', 'Celebrating diverse art forms and cultural expressions from various communities.'),
(4, 'Health and Wellness Expo', '2024-01-01', 'An expo focused on promoting health, wellness, and fitness among individuals.');

INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID)
	SELECT e.USER_GROUP_ID, u.USER_ID
	FROM USER_GROUP e
	CROSS JOIN USER u;

-- INSERT INTO USER_GROUP_TRANSACTION (USER_GROUP_ID, TRANSACTION_ID, PAID_BY_USER_ID, PAID_TO_USER_ID, USER_GROUP_TRANSACTION_DATE, USER_GROUP_TRANSACTION_AMOUNT, USER_GROUP_TRANSACTION_NOTES) VALUES
--  ();

COMMIT;