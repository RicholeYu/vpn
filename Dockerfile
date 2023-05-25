FROM philplckthun/strongswan

COPY . /app
WORKDIR /app
RUN git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2 yarn
RUN cd /app/go && yarn && yarn build
RUN cd /app/server && yarn && yarn build
CMD pm2 start /app/server/dist/main.js && bash /run.sh
