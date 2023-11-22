FROM node:16
RUN apt-get update && apt-get install -y nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
RUN apt-get update && apt-get install -y supervisor

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf

COPY . .

RUN npm run install
RUN npm run build

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 暴露80端口，用于提供nginx服务
EXPOSE 80
EXPOSE 3001

# 启动nginx服务和后端服务
CMD ["supervisord", "-c", "supervisord.conf"]
