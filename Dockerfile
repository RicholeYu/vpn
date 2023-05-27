FROM node AS builder
RUN rm -rf /builder
COPY . /builder
RUN cd /builder/go && yarn && yarn build
RUN cd /builder/server && yarn && yarn build

FROM philplckthun/strongswan AS base
RUN rm -rf /app /go /server /nvm
COPY --from=builder /builder/go /go
COPY --from=builder /builder/server /server
RUN git clone https://github.com/creationix/nvm.git /nvm
RUN . /nvm/nvm.sh && nvm install 14 && npm i -g pm2
CMD pm2 start /server/dist/main.js && bash /run.sh
