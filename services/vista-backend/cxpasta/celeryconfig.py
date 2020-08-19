import os
import yaml

config_file = os.getenv('config_file', 'vista_backend_local.yaml')
sys_config = yaml.load(open(os.path.join(os.getcwd(), 'etc/%s' % config_file)))

redis_url = sys_config['redis_url']
celery_broker_url = sys_config['celery_broker_url']
celery_result_backend = sys_config['celery_result_backend']
# print(redis_url)
# print(celery_broker_url)
# print(celery_result_backend)

# 配置消息队列，默认使用redis
# BROKER_URL = 'redis://10.75.44.16:6379/0'
BROKER_URL = redis_url
# 把任务结果存在了Redis 区分生成的key，使用不同的库，使用 keys * 查看 # 把任务结果存在了Redis
# CELERY_BROKER_URL = 'redis://10.75.44.16:6379/0'
CELERY_BROKER_URL = celery_broker_url
# CELERY_RESULT_BACKEND = 'redis://10.75.44.16:6379/0'
CELERY_RESULT_BACKEND = celery_result_backend
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'           # 读取任务结果一般性能要求不高，所以使用了可读性更好的JSON
CELERY_TASK_RESULT_EXPIRES = 60 * 60 * 24   # 任务过期时间，不建议直接写86400，应该让这样的magic数字表述更明显
CELERY_ACCEPT_CONTENT = ["json"]
