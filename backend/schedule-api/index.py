import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления расписанием занятий
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными расписания
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            group_id = params.get('group_id')
            teacher_id = params.get('teacher_id')
            
            query = '''
                SELECT s.*, 
                       g.name as group_name,
                       t.full_name as teacher_name,
                       c.name as campus_name
                FROM schedules s
                LEFT JOIN groups g ON s.group_id = g.id
                LEFT JOIN teachers t ON s.teacher_id = t.id
                LEFT JOIN campuses c ON s.campus_id = c.id
                WHERE 1=1
            '''
            
            if group_id:
                query += f" AND s.group_id = {int(group_id)}"
            if teacher_id:
                query += f" AND s.teacher_id = {int(teacher_id)}"
            
            query += " ORDER BY s.day_of_week, s.start_time"
            
            cursor.execute(query)
            schedules = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in schedules], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute('''
                INSERT INTO schedules 
                (group_id, teacher_id, campus_id, subject, room, day_of_week, start_time, end_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (
                body_data['group_id'],
                body_data['teacher_id'],
                body_data['campus_id'],
                body_data['subject'],
                body_data['room'],
                body_data['day_of_week'],
                body_data['start_time'],
                body_data['end_time']
            ))
            
            new_schedule = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_schedule), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            schedule_id = body_data.get('id')
            
            cursor.execute('''
                UPDATE schedules 
                SET group_id = %s, teacher_id = %s, campus_id = %s, 
                    subject = %s, room = %s, day_of_week = %s, 
                    start_time = %s, end_time = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            ''', (
                body_data['group_id'],
                body_data['teacher_id'],
                body_data['campus_id'],
                body_data['subject'],
                body_data['room'],
                body_data['day_of_week'],
                body_data['start_time'],
                body_data['end_time'],
                schedule_id
            ))
            
            updated_schedule = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_schedule), default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            schedule_id = params.get('id')
            
            cursor.execute('UPDATE schedules SET updated_at = CURRENT_TIMESTAMP WHERE id = %s', (schedule_id,))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Schedule deleted', 'id': schedule_id})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
