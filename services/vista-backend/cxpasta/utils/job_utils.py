import redis


def checkstatus(task_id):
    pool = redis.ConnectionPool(host='10.75.44.16', port=6379, db=0)
    r = redis.StrictRedis(connection_pool=pool)
    celery_pattern = 'celery-task-meta-'
    full_key = celery_pattern + task_id
    if r.get(full_key):
        return True
    else:
        return False


def check_async_task_status(async_func, task_id):
    # if checkstatus(task_id):
    task_obj = async_func.AsyncResult(task_id)

    if task_obj.state == 'SUCCESS':
        response = {
            'task_id': task_obj.id,
            'task_state': task_obj.state,
            'info': [],
            'data': task_obj.result
        }
    elif task_obj.state == 'PENDING':
        response = {
            'task_id': task_obj.id,
            'task_state': task_obj.state,
            'info': task_obj.info,
            'data': []
        }
    elif task_obj.state == 'FAILURE':
        response = {
            'task_id': task_obj.id,
            'task_state': task_obj.state,
            'info': task_obj.traceback,
            'data': []
        }

    return response
