CREATE TABLE IF NOT EXISTS campuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    campus_id INTEGER REFERENCES campuses(id),
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id),
    teacher_id INTEGER REFERENCES teachers(id),
    campus_id INTEGER REFERENCES campuses(id),
    subject VARCHAR(255) NOT NULL,
    room VARCHAR(50) NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedules_group ON schedules(group_id);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON schedules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day_of_week);

INSERT INTO campuses (name, address) 
SELECT 'Главный корпус', 'г. Хабаровск, ул. Ленина, 1'
WHERE NOT EXISTS (SELECT 1 FROM campuses WHERE name = 'Главный корпус');

INSERT INTO campuses (name, address) 
SELECT 'Корпус №2', 'г. Хабаровск, ул. Пушкина, 15'
WHERE NOT EXISTS (SELECT 1 FROM campuses WHERE name = 'Корпус №2');

INSERT INTO campuses (name, address) 
SELECT 'Корпус №3', 'г. Хабаровск, ул. Карла Маркса, 45'
WHERE NOT EXISTS (SELECT 1 FROM campuses WHERE name = 'Корпус №3');

INSERT INTO teachers (full_name, email, phone) 
SELECT 'Сидоров Иван Петрович', 'sidorov@college.ru', '+7 (999) 123-45-67'
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE email = 'sidorov@college.ru');

INSERT INTO teachers (full_name, email, phone) 
SELECT 'Иванова Мария Сергеевна', 'ivanova@college.ru', '+7 (999) 234-56-78'
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE email = 'ivanova@college.ru');

INSERT INTO teachers (full_name, email, phone) 
SELECT 'Петров Алексей Николаевич', 'petrov@college.ru', '+7 (999) 345-67-89'
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE email = 'petrov@college.ru');

INSERT INTO groups (name, campus_id, year) 
SELECT 'ЛА-23', 1, 2023
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'ЛА-23');

INSERT INTO groups (name, campus_id, year) 
SELECT 'ИС-22', 1, 2022
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'ИС-22');

INSERT INTO groups (name, campus_id, year) 
SELECT 'ПО-24', 2, 2024
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'ПО-24');

INSERT INTO groups (name, campus_id, year) 
SELECT 'КС-23', 3, 2023
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'КС-23');

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 1, 1, 1, 'Математика', 'А-101', 1, '09:00', '10:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 1 AND subject = 'Математика' AND day_of_week = 1);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 1, 1, 1, 'Физика', 'А-102', 1, '10:45', '12:15'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 1 AND subject = 'Физика' AND day_of_week = 1);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 1, 2, 1, 'Русский язык', 'Б-201', 2, '09:00', '10:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 1 AND subject = 'Русский язык' AND day_of_week = 2);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 1, 3, 1, 'Информатика', 'К-301', 3, '09:00', '10:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 1 AND subject = 'Информатика' AND day_of_week = 3);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 2, 1, 1, 'Алгебра', 'А-103', 1, '13:00', '14:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 2 AND subject = 'Алгебра' AND day_of_week = 1);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 2, 2, 1, 'Литература', 'Б-202', 2, '10:45', '12:15'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 2 AND subject = 'Литература' AND day_of_week = 2);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 3, 3, 2, 'Программирование', 'К-101', 1, '09:00', '10:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 3 AND subject = 'Программирование' AND day_of_week = 1);

INSERT INTO schedules (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) 
SELECT 4, 1, 3, 'Компьютерные сети', 'С-201', 1, '09:00', '10:30'
WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE group_id = 4 AND subject = 'Компьютерные сети' AND day_of_week = 1);