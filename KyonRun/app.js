const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { wait, writeScript } = require('./utils');

// app config
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));

// app static
app.get('/:id', (req, res) => {
  const { id } = req.params;
  if (id === 'favicon.ico') {
    res.sendStatus(200);
    return;
  } else if (id === '') {
    res.sendFile(`${__dirname}/dist/index.html`);
    return;
  }
  res.sendStatus(404);
});

// app interface
app.post('/run', (req, res) => {
  console.log(req.body);
  const scriptPath = `${__dirname}/scripts/tmp.js`;
  execute(scriptPath, req, res).then();
});

const pidDict = {};
async function execute(scriptPath, req, res) {
  console.log(`-- The script <${scriptPath}> begins execution...`);
  // resOutput: 输出
  const resOutput = [];
  // 等待其他请求执行script
  while (pidDict[scriptPath]) {
    resOutput.push('Waiting for another script request...');
    await wait(5000);
  }
  // 覆写文件内容
  writeScript(scriptPath, req.body['code']);
  // 子进程
  const handle = spawn('node', [scriptPath]);
  pidDict[scriptPath] = handle.pid;
  // 设置超时
  let timer = setTimeout(() => {
    resOutput.push('[KyonRun] TIMEOUT');
    handle.kill('SIGTERM');
  }, 20000);

  // handle
  handle.stdout.on('data', (data) => {
    resOutput.push(`${data}`);
  });

  handle.stderr.on('data', (data) => {
    resOutput.push(`${data}`);
  });

  handle.on('error', (code) => {
    resOutput.push(`[KyonRun ERROR] ${code}`);
    delete pidDict[scriptPath];
    if (timer) clearTimeout(timer); // 未超时
    res.json({
      code: -1,
      data: resOutput.join('\n')
    });
  });

  handle.on('close', (code, signal) => {
    console.log(`-- Child Process close with code<${code}>, signal<${signal}>`);
    delete pidDict[scriptPath];
    if (timer) clearTimeout(timer); // 未超时
    res.json({
      code, // 0: 正常退出; 1: 异常退出
      data: resOutput.join('\n')
    });
  });

  // res.json({ code: 0, data: req.body });
}

// app run
app.set('port', 4502);
app.listen(app.get('port'), () => {
  console.log(`[KyonRun] Server listening at ${app.get('port')}`);
});