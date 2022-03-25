/*
 * @Author       : 程哲林
 * @Date         : 2022-03-25 15:56:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-25 16:09:43
 * @FilePath     : /ipv6-ddns/src/utils/ipv6.ts
 * @Description  : 未添加文件描述
 */

import axios from 'axios'
import { logger } from './logger'

let memo = ''

export async function ipv6 () {
  try {
    const res = await axios.get('https://api64.ipify.org?format=json')
    const { status, data } = res

    if (status < 300) {
      const ip: string = data.ip
      if (ip.length > 18 && memo !== ip) {
        memo = ip;
        return {
          ip,
          prefix: ip.split(":").slice(0, 4).join(':')
        }
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
