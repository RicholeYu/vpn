FROM philplckthun/strongswan

copy ./sources.list /etc/apt/sources.list
# 安装 iptables
RUN apt-get update && apt-get install -y --force-yes git iptables && git clone https://github.com/creationix/nvm.git /usr/local/bin/nvm && source /usr/local/bin/nvm/nvm.sh && nvm install 14
copy . .
RUN nohup node index.js > ./log &