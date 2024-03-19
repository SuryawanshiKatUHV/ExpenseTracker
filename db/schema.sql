DROP SCHEMA IF EXISTS EXPENSE_TRACKER;
CREATE SCHEMA EXPENSE_TRACKER;

use EXPENSE_TRACKER;

CREATE TABLE USER (
  USER_ID INT PRIMARY KEY AUTO_INCREMENT,
  USER_FNAME VARCHAR(50) NOT NULL,
  USER_LNAME VARCHAR(50) NOT NULL,
  USER_EMAIL VARCHAR(100) NOT NULL UNIQUE,
  USER_PASSWORD VARCHAR(512) NOT NULL,
  
  CHECK (CHAR_LENGTH(USER_FNAME) >= 3 AND CHAR_LENGTH(USER_FNAME) <= 50),
  CHECK (CHAR_LENGTH(USER_LNAME) >= 3 AND CHAR_LENGTH(USER_LNAME) <= 50),
  CHECK (USER_EMAIL REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
);

CREATE TABLE CATEGORY (
  CATEGORY_ID INT PRIMARY KEY AUTO_INCREMENT,
  OWNER_ID INT NOT NULL,
  CATEGORY_TITLE VARCHAR(50) NOT NULL,
  CATEGORY_DESCRIPTION VARCHAR(100) NOT NULL,

  FOREIGN KEY(OWNER_ID) REFERENCES USER(USER_ID),
  UNIQUE(OWNER_ID, CATEGORY_TITLE),
  
  CHECK (CHAR_LENGTH(CATEGORY_TITLE) >= 3 AND CHAR_LENGTH(CATEGORY_TITLE) <= 50),
  CHECK (CHAR_LENGTH(CATEGORY_DESCRIPTION) <= 100)
);

CREATE TABLE USER_GROUP (
  USER_GROUP_ID INT PRIMARY KEY AUTO_INCREMENT,
  OWNER_ID INT NOT NULL,
  USER_GROUP_DATE DATE NOT NULL,
  USER_GROUP_TITLE VARCHAR(50) NOT NULL UNIQUE,
  USER_GROUP_DESCRIPTION VARCHAR(100),

  FOREIGN KEY(OWNER_ID) REFERENCES USER(USER_ID),

  UNIQUE(OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE),
  
  CHECK (CHAR_LENGTH(USER_GROUP_TITLE) >= 3 AND CHAR_LENGTH(USER_GROUP_TITLE) <= 50),
  CHECK (CHAR_LENGTH(USER_GROUP_DESCRIPTION) <= 100)
);

CREATE TABLE USER_GROUP_MEMBERSHIP (
  USER_GROUP_ID INT NOT NULL,
  MEMBER_ID INT NOT NULL,

  PRIMARY KEY (USER_GROUP_ID, MEMBER_ID),

  FOREIGN KEY(USER_GROUP_ID) REFERENCES USER_GROUP(USER_GROUP_ID),
  FOREIGN KEY(MEMBER_ID) REFERENCES USER(USER_ID)
);

CREATE TABLE TRANSACTION (
  TRANSACTION_ID INT PRIMARY KEY AUTO_INCREMENT,
  CATEGORY_ID INT NOT NULL,
  TRANSACTION_TYPE ENUM('Expense', 'Income') DEFAULT 'Expense' NOT NULL,
  TRANSACTION_DATE DATE NOT NULL,
  TRANSACTION_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  TRANSACTION_NOTES VARCHAR(100) NOT NULL,
  
  FOREIGN KEY(CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID),
  UNIQUE(CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES),
  
  CHECK (CHAR_LENGTH(TRANSACTION_NOTES) <= 100)
);

CREATE TABLE BUDGET (
  BUDGET_ID INT PRIMARY KEY AUTO_INCREMENT,
  CATEGORY_ID INT NOT NULL,
  BUDGET_DATE DATE NOT NULL,
  BUDGET_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  BUDGET_NOTES VARCHAR(100) NOT NULL,

  FOREIGN KEY(CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID),
  
  CHECK (CHAR_LENGTH(BUDGET_NOTES) <= 100)
);

CREATE TABLE USER_GROUP_TRANSACTION (
  USER_GROUP_TRANSACTION_ID INT PRIMARY KEY AUTO_INCREMENT,
  USER_GROUP_ID INT NOT NULL,
  TRANSACTION_ID INT NOT NULL,
  PAID_BY_USER_ID INT NOT NULL,
  PAID_TO_USER_ID INT NOT NULL,
  USER_GROUP_TRANSACTION_DATE DATE NOT NULL,
  USER_GROUP_TRANSACTION_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  USER_GROUP_TRANSACTION_NOTES VARCHAR(100) NOT NULL,

  FOREIGN KEY(USER_GROUP_ID) REFERENCES USER_GROUP(USER_GROUP_ID),
  FOREIGN KEY(TRANSACTION_ID) REFERENCES TRANSACTION(TRANSACTION_ID),
  FOREIGN KEY(PAID_BY_USER_ID) REFERENCES USER(USER_ID),
  FOREIGN KEY(PAID_TO_USER_ID) REFERENCES USER(USER_ID),
  
  CHECK (CHAR_LENGTH(USER_GROUP_TRANSACTION_NOTES) <= 100)
);

