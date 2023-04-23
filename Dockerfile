FROM node:latest

# 安装 iptables
RUN apt-get update && apt-get install -y iptables

# 设置工作目录
WORKDIR /app

# 复制应用程序代码到容器中
COPY . .

# 容器启动时执行的命令
CMD ["sh", "-c", "iptables && node index.js"]