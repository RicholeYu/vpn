FROM philplckthun/strongswan

COPY . /app
RUN rm -rf /nvm && git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2 yarn
WORKDIR /app/go
RUN yarn && yarn build
WORKDIR /app/server
RUN yarn && yarn build
CMD pm2 start /app/server/dist/main.js && bash /run.sh
