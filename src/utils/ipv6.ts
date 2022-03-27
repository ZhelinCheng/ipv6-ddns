/*
 * @Author       : 程哲林
 * @Date         : 2022-03-25 15:56:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-27 23:09:47
 * @FilePath     : \ipv6-ddns\src\utils\ipv6.ts
 * @Description  : 未添加文件描述
 */

import { logger } from './logger';
import os from 'os';

let memo = '';

const address = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName] || [];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv6' &&
        alias.address !== ':0:0:0:0:0:0:0:0' &&
        !alias.internal &&
        alias.address != '::'
      ) {
        return alias.address;
      }
    }
  }
};

export function ipv6() {
  try {
    const ip = address();
    if (ip && memo !== ip) {
      memo = ip;
      return {
        ip,
        prefix: ip.split(':').slice(0, 4).join(':'),
      };
    }
  } catch (e) {
    logger.error(e);
  }

  return {
    ip: '',
    prefix: '',
  };
}
