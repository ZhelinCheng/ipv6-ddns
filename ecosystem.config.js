/*
 * @Author       : Zhelin Cheng
 * @Date         : 2021-08-31 21:13:58
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-01-06 23:26:31
 * @FilePath     : \hpv_subscribe\ecosystem.config.js
 * @Description  : 未添加文件描述
 */
module.exports = {
    apps: [
      {
        name: 'hpv_subscribe',
        script: './dist/app.js',
        // eslint-disable-next-line no-undef
        cwd: __dirname,
        // Options reference: https://doc.pm2.io/en/runtime/guide/ecosystem-file/#ecosystem-file
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '250M',
        max_restarts: 3,
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };