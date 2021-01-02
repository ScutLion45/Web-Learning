const fs = require('fs');
const path = require('path');

// Use `chalk` to log colorful message.
// https://www.jb51.net/article/175493.htm
const warnChalk = require('chalk').keyword('orange');
const $WARN = msg => console.log(warnChalk(msg));

// JSDoc: https://www.jianshu.com/p/46519b0499c3
/**
 * Return the file type.
 *  @param {string} path - A path to a file. If a URL is provided, it must use the `file:` protocol.
 *  @returns {Number}
 *  `-1`: file does not exist;
 *   `0`: isDirectory;
 *   `1`: isFile;
 *   `2`: other file type;
 */
function getFileType(path) {
  // https://www.jianshu.com/p/5b52751873fd
  if(fs.existsSync(path)) {
    const lstat = fs.lstatSync(path);
    return (lstat.isDirectory() ? 0 : (lstat.isFile() ? 1 : 2));
  } else {
    return -1;
  }
}

/**
 * Get current time 'yyyy-mm-dd HH:MM:SS'
 */
function getDateTime() {
  const PAD_ZERO = s => s.padStart(2, '0');
  const now = new Date();
  // year
  const yyyy = now.getFullYear();
  // month
  const mm = PAD_ZERO(`${now.getMonth() + 1}`);
  // date
  const dd = PAD_ZERO(`${now.getDate()}`);
  // hours
  const HH = PAD_ZERO(`${now.getHours()}`);
  // minutes
  const MM = PAD_ZERO(`${now.getMinutes()}`);
  // seconds
  const SS = PAD_ZERO(`${now.getSeconds()}`);

  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
}

/**
 * Retreive the workspace directory.
 * @returns
 * 
 * ```
 * {
 *   year: {
 *     month: {
 *       date: [
 *         // projects: [fName, pFType]
 *       ]
 *     }
 *   }
 * }
 * ```
 */
function retreive() {
  /**
   * Dynamically generate Date RegExp for Layer.3
   * @param {string} month - 'yymmdd'-like string
   */ 
  function getP_REG(month) {
    // const M_REG = RegExp(`^${year}(0[1-9]|1[0-2])$`);
    const y = Number(month.substr(2, 2));
    const m = month.substr(4);
    // + 贪婪匹配 (-.+)*
    const innerP_REG = D_REG => RegExp(`^(${D_REG})(-.+)*(\..+)?$`);
    // console.log(y, m);
    switch (m) {
      case '01': case '03': case '05': case '07':
      case '08': case '10': case '12': {
        return innerP_REG(`${y}${m}(0[1-9]|[12][0-9]|3[0-1])`);
      }
      case '04': case '06': case '09': case '11': {
        return innerP_REG(`${y}${m}(0[1-9]|[12][0-9]|30)`);
      }
      case '02': {
        const year = 2000 + y;
        if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
          // leap year
          return innerP_REG(`${y}${m}(0[1-9]|[12][0-9])`);
        } else {
          // normal year
          return innerP_REG(`${y}${m}(0[1-9]|1[0-9]|2[0-8])`);
        }
      }
      default: {
        throw new Error(`Invalid month-string parameter ${month}`);
      }
    }
  }

  const yMap = {};
  // Layer.1 YEAR
  try {
    // Find YEAR directories, e.g. '2020'
    const years = fs.readdirSync('.').filter(fName => {
      if (getFileType(fName) !== 0) return false;
      return /^20\d{2}$/.test(fName);
    });
    // years.sort((a, b) => a[0] - b[0]); // readdirSync() has sorted the yList
    years.forEach(year => {
      yMap[year] = {};  // key: year; value: mMap
    });

    // Layer.2 MONTH
    for (let [year, mMap] of Object.entries(yMap)) {  // Automatically sorted by key(year)
      // if (year === '2021') continue;
      // Find MONTH directory, e.g. '202009'
      const M_REG = RegExp(`^${year}(0[1-9]|1[0-2])$`);
      const yPath = path.join('.', year);
      const months = fs.readdirSync(yPath).filter(fName => {
        const mPath = path.join(yPath, fName);
        if (getFileType(mPath) !== 0) return false;
        const test = M_REG.test(fName);
        if (!test) {
          // WARNING
          $WARN(`* Check the directory naming of month: [${mPath}]`);
        }
        return test;
      });
      months.forEach(month => {
        mMap[month] = {}; // key: month; value: pMap
      });

      // Layer.3 PROJECT
      for (let [month, pMap] of Object.entries(mMap)) { // Automatically sorted by key(month)
        // Find project directory or file, e.g. '200908-ReactLearning'
        const P_REG = getP_REG(month);  // yymmdd
        const mPath = path.join(yPath, month);
        fs.readdirSync(mPath).forEach(fName => {
          const pPath = path.join(mPath, fName);
          const pFType = getFileType(pPath);
          if (pFType < 0 && pFType > 1) return;
          const match = P_REG.exec(fName);
          if (!match) {
            // WARNING
            $WARN(`** Check the naming of project: [${pPath}]`);
            return;
          }
          // match { 0: fName, 1: $yymmdd, 2: $dd, 3: '-xxx', 4: '.xxx' }
          if (!pMap.hasOwnProperty(match[1])) {
            pMap[match[1]] = [];
          }
          pMap[match[1]].push([fName, pFType]);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }

  return yMap;
}

/**
 * Generate README.md.
 */
function generateReadme() {
  const yMap = retreive();
  // /*
  let readmeContent = `
# Web Learning
@2020 Web Learning Notes

> ⌛ *Update: ${getDateTime()}*
>
> ☑️ Auto-generated by running \`node generate_readme.script.js\`
> - requires [Node](https://nodejs.org) environment and run \`npm install\` to setup first

## Preview
  `.trim() + '\n';

  // Generate Preview
  let layerPrefix = prefix(1);
  for (let [year, mMap] of Object.entries(yMap)) { // Automatically sorted by key(year)
    // Layer.1 YEAR
    // Add prefix and year
    readmeContent += `${layerPrefix}📙 YEAR： ${year}\n`;
    layerPrefix = prefix(2);
    for (let [month, pMap] of Object.entries(mMap)) { // Automatically sorted by key(month)
      // Layer.2 MONTH
      // Add prefix and month
      readmeContent += `${layerPrefix}🌗 MONTH： ${month}\n`;
      layerPrefix = prefix(3);
      // const dates = Object.getOwnPropertyNames(pMap);  // Automatically sorted
      for (let [date, pList] of Object.entries(pMap)) {   // Automatically sorted by key(date)
        // Layer.3 DATE
        // Add prefix and date
        readmeContent += `${layerPrefix}🗒️ DATE： ${date}\n`;
        // Traverse the pList
        if (pList.length !== 0) readmeContent += '\n';
        for (let [fName, pFType] of pList) {
          const URL = [year, month, fName].join('/');
          readmeContent += `\n- [${fName}](${URL})`;
        }
      }

      // Restore the layer prefix
      layerPrefix = prefix(2);
    }

    // Restore the layer prefix
    layerPrefix = prefix(1);
  }

  // Write to README.md
  try {
    // console.log(readmeContent);
    fs.writeFileSync('README.md', readmeContent);
  } catch (error) {
    console.error(error);
  }

  // Prefix '#'
  function prefix(layer) {
    // return '\n#...# '
    return `\n${Array(layer+2).fill('#').join('')} `;
  }
  // */
  // console.log(JSON.stringify(rList));
}

/**
 * Call generateReadme.
 */
generateReadme();
