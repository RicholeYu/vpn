const http = require('http')
const fs = require('fs')
const childrenProcess = require('child_process')
const cache = {}
const commandClear = "-F INPUT"
const commandDropHTTP = '-I INPUT -p tcp --dport 1080 -j DROP'
const commandDropVPN = '-I INPUT -p udp --dport 500 -j DROP'
const commandPrivoxy = '-I INPUT -p tcp --dport 1080 -s privoxy -j ACCEPT'
const iptables = command => childrenProcess.spawnSync('iptables', command.split(' '))

iptables(commandClear)
iptables(commandDropHTTP)
iptables(commandDropVPN)
iptables(commandPrivoxy)

http.createServer((req, res) => {
  const ipPath = req.url.split('ip/')[1]
  const match = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(req.socket.remoteAddress) || []
  const ip = ipPath || match[1]

  if (req.url.includes('/go/') || req.url.includes('/has/')) {
    res.setHeader('Content-Type', 'text/html')
    return res.end(fs.readFileSync('./index.html').toString())
  }

  if (req.url.includes('/set/')) {
    const commandHTTP = `-I INPUT -p tcp --dport 1080 -s ${ip} -j ACCEPT`
    const commandVPNOUT = `-I INPUT -p udp --dport 500 -d ${ip} -j ACCEPT`
    const commandVPNIN = `-I INPUT -p udp --dport 500 -s ${ip} -j ACCEPT`
    iptables(commandHTTP)
    iptables(commandVPNOUT)
    iptables(commandVPNIN)

    res.setHeader('location', `http://vpn.richole.cn/set/ip/${ip}`);
    res.statusCode = 301
    return res.end('')
  }

  if (cache[ip]) {
    res.setHeader('location', `http://vpn.richole.cn/has/ip/${ip}`);
    res.statusCode = 301
    return res.end('')
  }

  if (ip) {
    res.setHeader('location', `http://vpn.richole.cn/go/ip/${ip}`);
    res.statusCode = 301
    return res.end('')
  }

  res.end('can not get remote ip')
}).listen(10000)
