import { Controller, Get, Headers, Logger, Param, Res } from '@nestjs/common';
import { spawnSync } from 'child_process';
import { Response } from 'express';

type Cache = {
  [ip: string]: boolean;
};

const commandClear = '-F INPUT';
const commandDropHTTP = '-I INPUT -p tcp --dport 1080 -j DROP';
const commandDropVPN = '-I INPUT -p udp --dport 500 -j DROP';
const commandPrivoxy = '-I INPUT -p tcp --dport 1080 -s privoxy -j ACCEPT';

@Controller()
export class AppController {
  cache: Cache = {};
  logger: Logger = new Logger(AppController.name);
  ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

  constructor() {
    this.iptables(commandClear);
    this.iptables(commandDropHTTP);
    this.iptables(commandDropVPN);
    this.iptables(commandPrivoxy);
  }

  iptables(command: string) {
    spawnSync('iptables', command.split(' '));
  }

  @Get('*')
  handle(
    @Headers('remote_addr') remoteAddress: string,
    @Res() response: Response,
  ) {
    if (this.cache[remoteAddress]) {
      return response.redirect(
        301,
        `http://vpn.richole.cn/go/has/${remoteAddress}`,
      );
    }

    if (remoteAddress && this.ipReg.test(remoteAddress)) {
      return response.redirect(
        301,
        `http://vpn.richole.cn/go/to/${remoteAddress}`,
      );
    }

    return response.redirect(
      301,
      `http://vpn.richole.cn/go/error/${remoteAddress}`,
    );
  }

  @Get('add/:remoteAddress')
  add(
    @Param('remoteAddress') remoteAddress: string,
    @Res() response: Response,
  ) {
    if (remoteAddress && this.ipReg.test(remoteAddress)) {
      this.cache[remoteAddress] = true;
      const commandHTTP = `-I INPUT -p tcp --dport 1080 -s ${remoteAddress} -j ACCEPT`;
      const commandVPNOUT = `-I INPUT -p udp --dport 500 -d ${remoteAddress} -j ACCEPT`;
      const commandVPNIN = `-I INPUT -p udp --dport 500 -s ${remoteAddress} -j ACCEPT`;
      this.iptables(commandHTTP);
      this.iptables(commandVPNIN);
      this.iptables(commandVPNOUT);

      this.logger.log(remoteAddress);
      return response.redirect(
        301,
        `http://vpn.richole.cn/go/set/${remoteAddress}`,
      );
    }

    return response.redirect(
      301,
      `http://vpn.richole.cn/go/error/${remoteAddress}`,
    );
  }
}
