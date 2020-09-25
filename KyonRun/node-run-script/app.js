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

app.get('/test/:id', (req, res) => {
  const { id } = req.params;
  res.send(`test_${id} #1`);
  // send只会执行一次，并会报错：Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  // res.send(`test_${id} #2`);
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
  const readable = new Readable();
  readable._read = () => {};
  readable.pipe(res); // return res: <stream.Writable>
  while (pidDict[id]) {
    readable.push('\nWaiting for another script request.');
    await wait(5000);
  }
  const handle = spawn('sh', [`./scripts/${filePath}`]);
  pidDict[id] = handle.pid;

  handle.stdout.on('data', (data) => {
    readable.push(`\n${data}`);
    // getLogger(filePath).log(`\n${data}`);
  });

  handle.stderr.on('data', (data) => {
    // getLogger(filePath).warn(`\n${data}`);
    readable.push(`\n${data}`);
  });

  handle.on('error', (code) => {
    // getLogger(filePath).error(`child process error with information: \n${code}`);
    readable.push(`child process error with information: \n${code}`);
    delete pidDict[id];
    readable.push(null);  // null表示读取结束
  });

  handle.on('close', (code) => {
    // getLogger(filePath).log(`child process close with code ${code}`);
    delete pidDict[id];
    readable.push(null);
  });
}

app.set('port', 3018);
app.listen(app.get('port'), () => console.log(`server listening at ${app.get('port')}`));
