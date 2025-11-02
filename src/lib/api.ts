const API_BASE = {
  schedule: 'https://functions.poehali.dev/952b0123-8580-45b2-850e-78aea783d07e',
  data: 'https://functions.poehali.dev/96e040ef-0668-4c29-b0fb-5d0e210b83e6',
  excelImport: 'https://functions.poehali.dev/5896518b-447c-4f5c-9614-ca9d3437f3f7'
};

export async function fetchAllData() {
  const response = await fetch(API_BASE.data);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}

export async function fetchSchedules(groupId?: number, teacherId?: number) {
  const params = new URLSearchParams();
  if (groupId) params.append('group_id', groupId.toString());
  if (teacherId) params.append('teacher_id', teacherId.toString());
  
  const url = `${API_BASE.schedule}${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  return response.json();
}

export async function createSchedule(data: {
  group_id: number;
  teacher_id: number;
  campus_id: number;
  subject: string;
  room: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}) {
  const response = await fetch(API_BASE.schedule, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create schedule');
  return response.json();
}

export async function updateSchedule(data: {
  id: number;
  group_id: number;
  teacher_id: number;
  campus_id: number;
  subject: string;
  room: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}) {
  const response = await fetch(API_BASE.schedule, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update schedule');
  return response.json();
}

export async function deleteSchedule(id: number) {
  const response = await fetch(`${API_BASE.schedule}?id=${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete schedule');
  return response.json();
}

export async function importExcelFile(fileContent: string) {
  const response = await fetch(API_BASE.excelImport, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: fileContent })
  });
  if (!response.ok) throw new Error('Failed to import Excel file');
  return response.json();
}
