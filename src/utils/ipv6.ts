/*
 * @Author       : 程哲林
 * @Date         : 2022-03-25 15:56:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-25 17:26:03
 * @FilePath     : /ipv6-ddns/src/utils/ipv6.ts
 * @Description  : 未添加文件描述
 */

import axios from 'axios'
import { logger } from './logger'
import { internalIpV6 } from 'internal-ip'

let memo = ''

export async function ipv6 () {
  try {
    const ip = await internalIpV6()
    if (ip && memo !== ip) {
      memo = ip;
      return {
        ip,
        prefix: ip.split(":").slice(0, 4).join(':')
      }
    }
  } catch(e) {
    logger.error(e)
  }

  return {
    ip: '',
    prefix: ''
  }
}
