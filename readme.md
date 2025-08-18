
# Basic Boilerplate : MVC + Rep and Svc

# Client → Route → Controller → Service → Repository → Model → DB

# UPDATE users SET role_id = 1 WHERE email = 'shifa@gmail.com';



# Find the record in role_permissions
SELECT * FROM role_permissions WHERE role_id = 3 AND permission_id = 2;

# Which role got the permission
# What that permission actually does (resource + action + possession)

SELECT r.name AS role_name, p.resource, p.action, p.possession
FROM role_permissions rp
JOIN roles r ON rp.role_id = r.id
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 3
  AND rp.permission_id = 2;


# Check all permissions for a given role
SELECT p.id, p.resource, p.action, p.possession
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 3;


Bhai, is roles–permissions–role\_permissions topic se bahut saare **SQL + RBAC logic** ke interview-style questions ban sakte hain.
Main tumhe **category-wise** bata deta hoon:

---

## **1. Basic Data Retrieval**

* Admin ke paas kaun-kaun si permissions hain?
* Ek permission kaun-kaun se roles ke paas hai?
* Sabhi roles ke saath unki permissions ka table dikhao.
* Sirf resource ka naam list karo jo admin role ke paas hai.

---

## **2. Filtering & Conditions**

* Sirf `user` resource ke liye admin ke paas kaun actions hain?
* Sirf `possession = 'any'` wali permissions kaun se roles ke paas hain?
* Multiple roles (admin, editor) ke liye permissions list karo.

---

## **3. Aggregation / Grouping**

* Har role ke paas kitni permissions hain, count karo.
* Har resource ke liye kitne roles ke paas access hai?
* Role ke paas saare permissions ek comma-separated string me dikhana.

---

## **4. Reverse Lookup**

* Kaun se roles ke paas `create` action ka access hai kisi bhi resource par?
* Kaun se roles ke paas `delete` action bilkul nahi hai?

---

## **5. Data Integrity Check**

* role\_permissions table me koi duplicate mapping hai ya nahi, check karo.
* Koi permission aisi hai jo kisi bhi role ke saath linked nahi hai?
* Koi role aisa hai jiske paas ek bhi permission nahi hai?

---

## **6. Advanced Joins / Subqueries**

* Ek role ke paas kaun si permissions **nahi** hain, list karo.
* Admin ke paas jo permissions hain, unke paas editor ke paas kaun se missing permissions hain?
* Common permissions between two roles ka list banao.

---

## **7. Real-World RBAC Scenarios**

* Agar tumhe `isAllowed(userId, resource, action)` function banana ho to SQL query kaise likhoge?
* Role delete karne par role\_permissions ka data kaise handle karoge? (Cascade delete vs manual delete)
* Permission rename/update hone par impact kaise handle karoge?


<!-- ///// DB DESIGN /// -->
CREATE TABLE users (
  id int auto_increment not null primary key,
  name varchar(100) not null,
  email varchar(100) not null unique,
  password varchar(100) not null
);

CREATE TABLE profile(
  id int auto_increment not null primary key,
  
);

CREATE TABLE roles( 
  id int auto_increment not null primary key,
  name varchar(100) not null
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE permissions(
  id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
  resource varchar(100),
  action varchar(100),
  possession varchar(100),
  `condition` varchar(100)
);

CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY(role_id,permission_id),
  FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE attributes (
   id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(120) NOT NULL
);

CREATE TABLE user_attributes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id int NOT NULL,
  attribute_id int NOT NULL,
  value varchar(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);

CREATE TABLE resource_attributes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  resource_name varchar(100) NOT NULL,
  attribute_id int NOT NULL,
  value varchar(100) NOT NULL,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);

CREATE TABLE policies (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(100) NOT NULL,
  effect enum('allow','deny') NOT NULL
);

CREATE TABLE policy_conditions (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  policy_id int NOT NULL,
  attribute_id int NOT NULL,
  operator enum('=','!=','>','<','>=','<=') NOT NULL,
  value varchar(100) NOT NULL,
  applies_to enum('user','resource') NOT NULL,
  FOREIGN KEY (policy_id) REFERENCES policies(id),
  FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);
