const http = require('http')
const childrenProcess = require('child_process')
const cache = {}
const commandClear = "-F INPUT"
const commandDropHTTP = '-I INPUT -p tcp --dport 1080 -j DROP'
const commandDropVPN = '-I INPUT -p udp --dport 500 -j DROP'
const iptables = command => childrenProcess.spawnSync('iptables', command.split(' '))

iptables(commandClear)
iptables(commandDropHTTP)
iptables(commandDropVPN)

http.createServer((req, res) => {
  const ipPath = req.url.split('ip/')[1]
  const match = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(req.socket.remoteAddress) || []
  const ip = ipPath || match[1]
  const commandHTTP = `-I INPUT -p tcp --dport 1080 -s ${ip} -j ACCEPT`
  const commandVPNOUT = `-I INPUT -p udp --dport 500 -d ${ip} -j ACCEPT`
  const commandVPNIN = `-I INPUT -p udp --dport 500 -s ${ip} -j ACCEPT`
  console.log(ip, ipPath)

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

