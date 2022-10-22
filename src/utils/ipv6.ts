/*
 * @Author       : 程哲林
 * @Date         : 2022-03-25 15:56:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-10-22 16:48:21
 * @FilePath     : /ipv6-ddns/src/utils/ipv6.ts
 * @Description  : 未添加文件描述
 */

import { logger } from './logger';
import axios from 'axios';

let memo = '';

// https://v6.ipv6-test.com/api/myip.php

const address = async (): Promise<string> => {
  const { status, data } = await axios.get('https://v6.ipv6-test.com/api/myip.php')
  return status === 200 ? data : ''
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
