INSERT INTO department(id, department_name)
VALUES (1, "Board"),
  (2, "Sales"),
  (3, "Finance"),
  (4, "Engineering"),
  (5, "Legal");
INSERT INTO role(department_id, title, salary)
VALUES (1, "CEO", 1000000),
  (2, "Sales Lead", 80000),
  (2, "Sales Associate", 50000),
  (3, "Accountant Manager", 103000),
  (3, "Accountant", 750000),
  (4, "Senior Engineer", 180000),
  (4, "Mid Engineer", 130000),
  (5, "Legal Team Lead", 110000),
  (5, "Lawyer", 105000);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tyler", "Smith", 1, NULL),
  ("Chris", "White", 2, 1),
  ("Tristan", "Williams", 3, 2),
  ("Alyssa", "Pratt", 4, 1),
  ("Brian", "Grey", 5, 4),
  ("Grace", "Carter", 6, 1),
  ("Cory", "Thomas", 7, 6),
  ("Robert", "Stone", 8, 1),
  ("Julia", "Johnson", 9, 8);