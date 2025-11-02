-- Создание таблиц для системы расписания колледжа

-- Таблица кампусов
CREATE TABLE IF NOT EXISTS campuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица преподавателей
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица групп
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    campus_id INTEGER REFERENCES campuses(id),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей (для персонализации)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    favorite_group_id INTEGER REFERENCES groups(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица расписания
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id),
    teacher_id INTEGER REFERENCES teachers(id),
    campus_id INTEGER REFERENCES campuses(id),
    subject VARCHAR(255) NOT NULL,
    room VARCHAR(50),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_schedule_group ON schedule(group_id);
CREATE INDEX IF NOT EXISTS idx_schedule_teacher ON schedule(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedule_day ON schedule(day_of_week);
CREATE INDEX IF NOT EXISTS idx_groups_campus ON groups(campus_id);

-- Вставка тестовых данных
INSERT INTO campuses (name, address) VALUES
    ('Главный корпус', 'г. Хабаровск, ул. Ленина, 1'),
    ('Корпус №2', 'г. Хабаровск, ул. Пушкина, 15'),
    ('Корпус №3', 'г. Хабаровск, ул. Карла Маркса, 45');

INSERT INTO teachers (full_name, email, phone) VALUES
    ('Сидоров Иван Петрович', 'sidorov@college.ru', '+7 (999) 123-45-67'),
    ('Иванова Мария Сергеевна', 'ivanova@college.ru', '+7 (999) 234-56-78'),
    ('Петров Алексей Николаевич', 'petrov@college.ru', '+7 (999) 345-67-89');

INSERT INTO groups (name, campus_id, year) VALUES
    ('ЛА-23', 1, 2023),
    ('ИС-22', 1, 2022),
    ('ПО-24', 2, 2024),
    ('КС-23', 3, 2023);

INSERT INTO users (username, email, favorite_group_id) VALUES
    ('student1', 'student1@example.com', 1);

INSERT INTO schedule (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time) VALUES
    (1, 1, 1, 'Математика', 'А-101', 1, '09:00', '10:30'),
    (1, 1, 1, 'Физика', 'А-102', 1, '10:45', '12:15'),
    (1, 2, 1, 'Русский язык', 'Б-201', 2, '09:00', '10:30'),
    (1, 3, 1, 'Информатика', 'К-301', 3, '09:00', '10:30'),
    (2, 1, 1, 'Алгебра', 'А-103', 1, '13:00', '14:30'),
    (2, 2, 1, 'Литература', 'Б-202', 2, '10:45', '12:15'),
    (3, 3, 2, 'Программирование', 'К-101', 1, '09:00', '10:30'),
    (4, 1, 3, 'Компьютерные сети', 'С-201', 1, '09:00', '10:30');