FROM philplckthun/strongswan

RUN git clone https://github.com/creationix/nvm.git /nvm
COPY index.js /index.js

CMD . /nvm/nvm.sh && nvm install 14 && npm i -g pm2 && pm2 start index.js && bash /run.sh