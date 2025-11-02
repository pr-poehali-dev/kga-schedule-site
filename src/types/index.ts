export interface Campus {
  id: number;
  name: string;
  address: string;
}

export interface Teacher {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface Group {
  id: number;
  name: string;
  campus_id: number;
  year: number;
}

export interface Schedule {
  id: number;
  group_id: number;
  teacher_id: number;
  campus_id: number;
  subject: string;
  room: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}
