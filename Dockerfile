FROM philplckthun/strongswan

RUN git clone https://github.com/creationix/nvm.git /usr1/nvm
copy . .

CMD . /usr1/nvm/nvm.sh && nvm install 14 && nohup node index.js > log & && bash /run.sh