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



