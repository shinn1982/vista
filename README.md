# vista

Visual Intelligence and Speculation of Traffic Analysis

## 1. 安装部署

### 1.1 vista-backend

** vista-backend基于Python3.6 **

#### 安装依赖

```
cd vista/cxcomm
python setup.py install
cd ..
pip install -r requirements.txt
```

#### 配置本地环境 

> 相关环境：
> - mongo(4.2.7)
> - redis(5.0.5)

创建本地配置文件vista_backend_local.yaml，保存在vista/services/vista-backend/etc/目录下，

```
log:
  level: DEBUG
  handler: file
  file_dir: /home/control/yare-core-log/vista-backend
  file_name: vista_backend.log

mongo_url: mongodb://0.0.0.0:27017/pasta

redis_url: redis://0.0.0.0:6379/0

celery_broker_url: redis://0.0.0.0:6379/0

celery_result_backend: redis://0.0.0.0:6379/0
```

> Tips：
> 1. 根据本地环境配置对应mongo和redis url
> 2. 根据本地环境配置log输入参数

#### 本地部署vista-backend

```
cd vista/services/vista-backend
gunicorn --bind=0.0.0.0:8000 cxpasta.wsgi:application
```

可以通过Postman或者其他API调试、请求工具访问vista后台API

### 1.2 vista web-portal

web-portal的环境安装及启动步骤，请参考vista/vista/README.md。

## 2. vista-backend API文档

vista-backend API接口文档index.html，保存在vista/docs/vista-backend/html目录中。



