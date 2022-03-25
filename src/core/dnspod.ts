/*
 * @Author       : 程哲林
 * @Date         : 2022-03-24 21:20:32
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-25 15:51:29
 * @FilePath     : /ipv6-ddns/src/core/dnspod.ts
 * @Description  : 未添加文件描述
 */

import axios from 'axios';
import QS from 'qs';
import { logger } from '../utils';

const env = process.env;

const conf = {
  login_token: `${env.DDNS_TOKEN_ID},${env.DDNS_TOKEN}`,
  format: 'json',
  lang: 'cn',
};

interface ResType {
  status: {
    code: string;
    message: string;
    created_at: string;
  };
}

async function rq<T>(type: string, data = {}): Promise<(ResType & T) | null> {
  const res = await axios({
    url: `https://dnsapi.cn/${type}`,
    method: 'POST',
    data: QS.stringify({
      ...conf,
      ...data,
    }),
  });

  if (res.status <= 300) {
    const code = res?.data?.status?.code;
    if (code === '1') {
      return res.data;
    } else {
      logger.error(res.data?.status?.message || '未知错误');
      return null;
    }
  } else {
    logger.error('数据获取错误，HTTP Status：', res.status);
    return null;
  }
}

interface InquiryType {
  domain: Domain;
  info: Info;
  records: Record[];
}

interface Record {
  id: string;
  name: string;
  line: string;
  line_id: string;
  type: string;
  ttl: string;
  value: string;
  weight?: any;
  mx: string;
  enabled: string;
  status: string;
  monitor_status: string;
  remark: string;
  updated_on: string;
  use_aqb: string;
}

interface Info {
  sub_domains: string;
  record_total: string;
  records_num: string;
}

interface Domain {
  id: string;
  name: string;
  punycode: string;
  grade: string;
  owner: string;
  ext_status: string;
  ttl: number;
  dnspod_ns: string[];
}

/**
 * 查询
 * @param domain 主域
 */
export async function inquiry(domain: string) {
  const res = await rq<InquiryType>('Record.List', {
    domain,
  });

  if (res) {
    return (res.records || []).filter(({ type }) => type !== 'NS').map(({ name, type, id }) => {
      return {
        name,
        type,
        id
      }
    });
  }

  return [];
}

/**
 * 创建
 */
export async function create(item: {
  sub_domain: string;
  domain: string;
  record_type: string;
  value: string;
}) {
  const res = await rq<InquiryType>('Record.Create', {
    ...item,
    record_line: '默认',
    mx: 1,
  });

  if (res) {
    logger.info(`创建成功[${item.record_type}]：${item.sub_domain}.${item.domain} => ${item.value}` )
    return item.sub_domain
  }

  return null
}

/**
 * 更新
 */
export async function update(item: {
  sub_domain: string;
  record_id: string;
  domain: string;
  record_type: string;
  value: string;
}) {
  const res = await rq<InquiryType>('Record.Modify', {
    ...item,
    record_line: '默认',
    mx: 0,
  });

  if (res) {
    logger.info(`更新成功[${item.record_type}]：${item.sub_domain}.${item.domain} => ${item.value}` )
    return item.sub_domain
  }

  return null
}
