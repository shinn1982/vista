# Vista

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.2.

## Angular开发相关环境
- node: v12.12.0
- npm: v6.11.3
- angular-cli: ~8.3.2
- Angular: ~8.2.4
  
## 开发服务器

运行 `ng serve` 可以启动开发服务器。在浏览器中输入 `http://localhost:4200/`，可以访问此应用。当源代码发生任何改变时，应用会自动刷新重载。

## 打包

在项目根路径下运行命令 `ng build`进行打包，如果需要发布版本，请执行以下命令：
```
ng build --prod --build-optimizer
```

在 `dist/`目录下会生成打包文件。



## 部署
- 安装nginx
- 把dist文件夹拷贝到`nginx/html`下，并将dist文件夹重命名为`vista`
- 修改nginx配置文件
- 重新启动nginx
- 在浏览器中输入配置地址查看是否部署成功


### Nginx配置

打开nginx配置文件，位于nginx目录下的`conf/nginx.conf`


修改配置文件中的server部分：


```
server {

  listen 80;

  sendfile on;

  default_type application/octet-stream;


  gzip on;
  gzip_http_version 1.1;
  gzip_disable      "MSIE [1-6]\.";
  gzip_min_length   256;
  gzip_vary         on;
  gzip_proxied      expired no-cache no-store private auth;
  gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
  gzip_comp_level   9;


  root /usr/share/nginx/html/vista;
  underscores_in_headers on; 

  location / {
    try_files $uri $uri/ /index.html =404;
  }
  location /api/ {
    proxy_pass http://10.124.209.255:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers  on;
  }
}
```
> Tips：
> 1. `listen` 是配置监听端口号，默认80，可根据实际情况修改
> 2. `root` 指定项目静态打包文件的地址，可根据实际情况修改
> 3. `proxy_pass` 是配置请求转向backend定义的服务器列表，格式是`proxy_pass  http:ip:port`，`ip`和`port`需要修改根据部署环境进行修改。


## 防火墙端口开启
需要开启80端口
