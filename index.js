const http = require('http')
const childrenProcess = require('child_process')
const cache = {}
const commandDropHTTP = '-I FORWARD -p tcp --dport 1080 -j DROP'
const commandDropVPN = '-I FORWARD -p udp --dport 500 -j DROP'
const iptables = command => childrenProcess.spawnSync('iptables', command.split(' '))

iptables(commandDropHTTP)
iptables(commandDropVPN)

http.createServer((req, res) => {
  const ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(req.socket.remoteAddress)?.[0]
  const commandHTTP = `-I FORWARD -p tcp --dport 1080 -s ${ip} -j ACCEPT`
  const commandVPNOUT = `-I FORWARD -p udp --dport 500 -d ${ip} -j ACCEPT`
  const commandVPNIN = `-I FORWARD -p udp --dport 500 -s ${ip} -j ACCEPT`

  if (cache[ip]) {
    return res.end(`${ip} is already in whiteList`)
  } if (ip) {
    cache[ip] = true
    iptables(commandHTTP)
    iptables(commandVPNIN)
    iptables(commandVPNOUT)
    return res.end(`iptables for ${ip} is set successfully`)
  }

  res.end('can not get remote ip')
}).listen(10000)
