/*
 * @Author       : Zhelin Cheng
 * @Date         : 2021-08-31 16:21:44
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-27 23:13:37
 * @FilePath     : \ipv6-ddns\src\app.ts
 * @Description  : 未添加文件描述
 */

import 'dotenv/config';
import { logger, ipv6 } from './utils';
import path from 'path';
import fse from 'fs-extra';
import fs from 'fs';
import { mapLimit } from 'async';
import { CronJob } from 'cron';

const env = process.env;

const support = ['dnspod'];

interface DDNSType {
  name: string;
  type: string;
  value: string;
  record_id?: string;
  create?: boolean;
}

async function main() {
  const interval = env.DDNS_INTERVAL || '10';

  // console.log('本地IPv6：', ipv6());

  logger.info(`检查更新间隔：${interval}分钟`);

  const server = env.DDNS_SERVER || '';
  const domain = env.DDNS_DOMAIN || '';
  const ddnsPath = path.join(__dirname, '../ddns.json');

  if (!fs.existsSync(ddnsPath)) {
    fse.ensureFileSync(ddnsPath);
    fse.outputJSONSync(ddnsPath, `[]`);
    logger.warn('请填写ddns.json配置文件');
  }

  // 获取DDNS配置
  const ddns: DDNSType[] = fse.readJSONSync(ddnsPath);

  if (!support.includes(server)) {
    return logger.error(`不支持${server}服务`);
  }

  if (!server || !domain) {
    return logger.error(`请选择服务商及填写域名`);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fn = require(`./core/${server}`);

  new CronJob(
    `0 0/${interval} * * * *`,
    async () => {
      try {
        const { ip, prefix } = ipv6();

        if (!ip) {
          return logger.info(`ip未更新或未获取到ipv6地址，暂不更新`);
        }

        logger.info(`IPV6前缀：${prefix}`);

        const recordList: Array<{
          name: string;
          type: string;
          id: string;
        }> = await fn.inquiry(domain);

        const ipv4Names: string[] = [];
        const ipv6Names: string[] = [];
        const recordIdMap: {
          [key: string]: {
            [key: string]: string;
          };
        } = {
          ipv4: {},
          ipv6: {},
        };

        recordList.forEach(({ name, type, id }) => {
          if (type === 'AAAA') {
            ipv6Names.push(name);
            recordIdMap.ipv6[name] = id;
          } else {
            ipv4Names.push(name);
            recordIdMap.ipv4[name] = id;
          }
        });

        const updateDdns: DDNSType[] = ddns.map((item) => {
          const { type, name } = item;
          // IPV6更新
          if (type === 'AAAA') {
            return {
              ...item,
              value: `${prefix}:${item.value}`,
              record_id: recordIdMap.ipv6[name],
              create: !ipv6Names.includes(name),
            };
          } else {
            return {
              ...item,
              record_id: recordIdMap.ipv4[name],
              create: !ipv4Names.includes(name),
            };
          }
        });

        await mapLimit(
          updateDdns,
          2,
          async function ({ value, type, name, create, record_id }: DDNSType) {
            if (create) {
              return fn.create({
                sub_domain: name,
                domain,
                record_type: type,
                value,
              });
            } else {
              return fn.update({
                sub_domain: name,
                record_id,
                domain,
                record_type: type,
                value,
              });
            }
          },
        );

        logger.info(`更新完成`);
      } catch (e) {
        logger.error(e);
      }
    },
    null,
    true,
    'Asia/Shanghai',
  );
}

main()
  .then(() => {
    logger.info(`启动成功`);
  })
  .catch(console.error);
