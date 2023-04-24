FROM philplckthun/strongswan

RUN git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2

CMD pm2 start index.js && bash /run.sh
