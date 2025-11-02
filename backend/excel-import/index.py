import json
import os
import base64
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import openpyxl
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для импорта расписания из Excel файлов
    Args: event с httpMethod, body (base64 encoded Excel file)
    Returns: HTTP response с результатом импорта
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    file_content = body_data.get('file')
    
    if not file_content:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No file provided'})
        }
    
    try:
        file_bytes = base64.b64decode(file_content)
        workbook = openpyxl.load_workbook(BytesIO(file_bytes))
        sheet = workbook.active
        
        conn = psycopg2.connect(dsn)
        conn.autocommit = True
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        imported_count = 0
        errors = []
        
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            if not row[0]:
                continue
            
            try:
                group_name = str(row[0]).strip()
                subject = str(row[1]).strip()
                teacher_name = str(row[2]).strip()
                room = str(row[3]).strip()
                day_of_week = int(row[4])
                start_time = str(row[5])
                end_time = str(row[6])
                campus_name = str(row[7]).strip()
                
                cursor.execute("SELECT id FROM groups WHERE name = %s", (group_name,))
                group_result = cursor.fetchone()
                if not group_result:
                    errors.append(f'Строка {row_idx}: группа "{group_name}" не найдена')
                    continue
                group_id = group_result['id']
                
                cursor.execute("SELECT id FROM teachers WHERE full_name = %s", (teacher_name,))
                teacher_result = cursor.fetchone()
                if not teacher_result:
                    errors.append(f'Строка {row_idx}: преподаватель "{teacher_name}" не найден')
                    continue
                teacher_id = teacher_result['id']
                
                cursor.execute("SELECT id FROM campuses WHERE name = %s", (campus_name,))
                campus_result = cursor.fetchone()
                if not campus_result:
                    errors.append(f'Строка {row_idx}: кампус "{campus_name}" не найден')
                    continue
                campus_id = campus_result['id']
                
                cursor.execute('''
                    INSERT INTO schedules 
                    (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ''', (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time))
                
                imported_count += 1
                
            except Exception as e:
                errors.append(f'Строка {row_idx}: {str(e)}')
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'imported': imported_count,
                'errors': errors,
                'message': f'Импортировано занятий: {imported_count}'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка обработки файла: {str(e)}'})
        }
