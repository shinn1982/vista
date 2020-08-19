# vista

Visual Intelligence and Speculation of Traffic Analysis

** 开发基于Python3.6 **

## 1. 安装部署

### 1.1 安装依赖

```
cd vista/cxcomm
python setup.py install
cd ..
pip install -r requirements.txt
```

### 1.2 本地部署vista-backend

```
cd vista/services/vista-backend
gunicorn --bind=0.0.0.0:8000 cxpasta.wsgi:application
```

可以通过Postman或者其他API调试、请求工具访问vista后台API

## 2. API文档

vista-backend API接口文档，保存在vista/docs/vista-backend/html/index.html中。



