const express = require('express');
const { spawn } = require('child_process');
const { Readable } = require('stream');
const { wait, getLogger } = require('./utility');

const app = express();

app.get('/:id', (req, res) => {
  // 执行脚本
  const { id } = req.params;
  if (id === 'favicon.ico') {
    res.sendStatus(200);
    return;
  }
  execute(id, res).then();
});

const pidDict = {};

/**
 * 执行sh脚本
 *
 * @param id 脚本id
 * @param res response object
 */
/* eslint-disable no-underscore-dangle, no-await-in-loop */
async function execute(id, res) {
  delete require.cache[require.resolve('./config.json')];
  const config = require('./config.json');
  const filePath = config[id];
  if (!filePath) {
    res.sendStatus(404);
    return;
  }
  console.log(`The script:${filePath} with ${id} begin execute`);
  const resOutput = [];
  while (pidDict[id]) {
    resOutput.push('Waiting for another script request.');
    await wait(5000);
  }
  const handle = spawn('sh', [`./scripts/${filePath}`]);
  pidDict[id] = handle.pid;
  // 设置超时
  let timer = setTimeout(() => {
    handle.kill('SIGTERM');
  }, 3000);

  handle.stdout.on('data', (data) => {
    resOutput.push(`${data}`);
    // getLogger(filePath).log(`\n${data}`);
  });

  handle.stderr.on('data', (data) => {
    // getLogger(filePath).warn(`\n${data}`);
    resOutput.push(`${data}`);
  });

  handle.on('error', (code) => {
    // getLogger(filePath).error(`child process error with information: \n${code}`);
    resOutput.push(`child process error with information: \n${code}`);
    delete pidDict[id];
    // if (timer) clearTimeout(timer);
    res.send(resOutput.join('\n'));
  });

  handle.on('close', (code, signal) => {
    // getLogger(filePath).log(`child process close with code ${code}`);
    console.log(`child process close with code ${code}; signal ${signal}`);
    delete pidDict[id];
    // if (timer) clearTimeout(timer);
    res.send(resOutput.join('\n'));
  });
}

app.set('port', 3018);
app.listen(app.get('port'), () => console.log(`server listening at ${app.get('port')}`));
