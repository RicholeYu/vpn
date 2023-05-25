FROM node as builder
COPY . /app
WORKDIR /app/go
RUN npm install && npm run build
WORKDIR /app/server
RUN npm install && npm run build

FROM philplckthun/strongswan
COPY . /app
COPY --from=builder /app/go/dist /app/go/dist
COPY --from=builder /app/server/dist /app/server/dist
RUN rm -rf /nvm && git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2
CMD pm2 start /app/server/dist/main.js && bash /run.sh
