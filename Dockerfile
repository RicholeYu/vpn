FROM philplckthun/strongswan

COPY . /app
RUN rm -rf /nvm && git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2
WORKDIR /app/go
RUN npm install && npm run build
WORKDIR /app/server
RUN npm install && npm run build
CMD pm2 start /app/server/dist/main.js && bash /run.sh
