/*
 * @Author       : Zhelin Cheng
 * @Date         : 2021-08-31 16:21:44
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-03-24 21:51:44
 * @FilePath     : \ipv6-ddns\src\app.ts
 * @Description  : 未添加文件描述
 */

import { logger } from './utils';
import 'dotenv/config';

const env = process.env;

const support = ['dnspod'];

async function main() {
  const server = env.DDNS_SERVER || '';

  if (!support.includes(server)) {
    return logger.error(`不支持${server}服务`);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fn = require(`./core/${server}`);

  await fn.inquiry();
}

main()
  .then(() => {
    logger.info(`启动成功`);
  })
  .catch(console.error);
