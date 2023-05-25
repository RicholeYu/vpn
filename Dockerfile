FROM philplckthun/strongswan

COPY . /app
WORKDIR /app

RUN git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2 yarn
RUN npm install

CMD pm2 start index.js && bash /run.sh
