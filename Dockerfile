FROM philplckthun/strongswan

# 安装 iptables
RUN apt-get update && apt-get install -y iptables && apt-get install -y node
copy . .
RUN nohup node index.js > ./log &