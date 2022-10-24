/*
 * @Author       : 程哲林
 * @Date         : 2022-03-25 15:56:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-10-24 16:09:21
 * @FilePath     : /ipv6-ddns/src/utils/ipv6.ts
 * @Description  : 未添加文件描述
 */

import { logger } from './logger';
import { exec } from 'child_process'

let memo = '';

// https://v6.ipv6-test.com/api/myip.php

const address = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec('curl 6.ipw.cn', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
};

export async function ipv6() {
  try {
    const ip = await address();
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
