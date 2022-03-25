/*
 * @Author       : 程哲林
 * @Date         : 2022-03-24 21:20:32
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-25 13:45:50
 * @FilePath     : \ipv6-ddns\src\core\dnspod.ts
 * @Description  : 未添加文件描述
 */

import axios from 'axios';
import QS from 'qs';

const env = process.env;

const conf = {
  login_token: `${env.DDNS_TOKEN_ID},${env.DDNS_TOKEN}`,
  format: 'json',
  lang: 'cn',
};

const rq = async (type: string, data = {}) => {
  const res = await axios({
    url: `https://dnsapi.cn/${type}`,
    method: 'POST',
    data: QS.stringify({
      ...conf,
      ...data,
    }),
  });

  if (res.status <= 300) {
    return res.data;
  } else {
    return null;
  }
};

/**
 * 查询
 * @param domain 主域
 */
export async function inquiry(domain: string) {
  const res = await rq('Record.List', {
    domain,
  });

  console.log(res);
}

/**
 * 创建
 * @param sub 子域
 * @param domain 主域
 */
// export async function create(sub: string, domain: string) {}

/**
 * 更新
 * @param sub 子域
 * @param domain 主域
 */
// export async function update(sub: string, domain: string) {}
