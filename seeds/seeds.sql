INSERT INTO department (department_name)
VALUES ("Marketing"), ("Law"), ("Engineering"), ("Business");

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Lead", 55000, 1),
("Marketing Coordinator", 45000, 1),
("Lawyer", 95000, 2),
("Paralegal", 50000, 2),
("Law Clerk", 35000, 2),
("Lead Engineer", 90000, 3),
("Senior Engineer", 85000, 3),
("Junior Engineer", 50000, 3),
("Business Analyst", 55000, 4),
("Business Consultant", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Once", 1, NULL),
("Ed", "Young", 2, 1),
("Kay", "Al", 3, NULL),
("Rita", "Asta", 4, 3),
("Jerm", "Gorg", 5, 3),
("Ali", "Masqsood", 6, NULL),
("Erik", "Luna", 7, 6),
("Renato", "Cordova", 8, 6),
("Kole", "McMil", 9, NULL),
("Dan", "Aguire", 10, 9)

