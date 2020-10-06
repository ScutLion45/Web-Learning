// https://blog.csdn.net/m0_37566424/article/details/104605185

function stringify (data, replacer = null, space = '') {
  const O2String = Object.prototype.toString;
  
  // 获取数据类型
  const getType = data => O2String.call(data).slice(8,-1).toLowerCase();

  // 处理stringify的replacer
  // - 如果是函数：直接调用函数
  // - 如果是数组：没有key时或者包含key时返回数据本身，否则返回undefined
  const replacerCallback = (key = '', value) => {
    const type = getType(replacer);
    switch (type) {
      case 'function': return replacer(key, value);
      case 'array': return ('' === key || replacer.includes(key)) ?
                    value :
                    undefined;
      default: return value;
    };
  };

  // 处理strigify的space
  // - 如果是数字：表示填充空格的个数，最多10个，小于1表示没有空格
  // - 如果是字符串，则用该字符串填充，只截取最多前10的长度
  const getSpaceStr = () => {
    const type = getType(space);
    if (type === 'number') {
      if (isFinite(space) && space > 0) {
        if (space > 10) {
          return Array(10).fill(' ').join('');
        }
        return Array(space).fill(' ').join('');
      }
      // NaN 或 ±Infinity
      return '';
    } else if (type === 'string') {
      // 截取最多前10的长度
      return space.slice(0, 10);
    }
    return '';
  };

  // 初始化填充字符串
  const spaceStr = getSpaceStr();
  const needBeautify = (spaceStr.length > 0);
  // 获取缩进的字符串
  const getPadStr = level => '\n' + Array(level).fill(spaceStr).join('');
  // 填充缩进的字符串
  const formatResult = (data, level = 0) => {
    if (!needBeautify || 0 === level) {
      return data;
    }
    return getPadStr(level) + data;
  };

  // 格式化 -----------------------------------------------------
  // 格式化对象
  const formatObject = (data, level = 0) => {
    // data:  string[], e.g.: [ '"x":1', '"y":2' ]
    // level: number
    if (data.length === 0) {
      return formatResult('{}', level);
    }
    return '{'
            + data.map(item => formatResult(item, level+1)) // data.map返回数组，再调用toString自动补充逗号
            + ((needBeautify && level === 0) ? '\n' : '')
            + formatResult('}', level);
  };

  // 格式化数组
  const formatArray = (data, level = 0) => {
    // data:  string[], e.g.: [ '"x"', '"y"', '2' ]
    // level: number
    if (data.length === 0) {
      return formatResult('[]', level);
    }

    const res = '['
    + data.map(item => formatResult(item, level+1))
    + ((needBeautify && level === 0) ? '\n' : '')
    + formatResult(']', level);

    const padStr = getPadStr(level+1);
    const reg = new RegExp(`${padStr}${padStr}`, 'g');
    return res.replace(reg, padStr);
  };

  // 转译
  const translate = (key, origin, level) => {
    // key:    数据的键
    // origin: 数据的原始值
    // level:  数据在原始数据中的嵌套层数
    let data = replacerCallback(key, origin);
    switch (getType(data)) {
      case 'boolean': return `${data}`;
      case 'string': return `"${data}"`;
      case 'number': return isFinite(data) ? `${data}` : 'null';
      case 'undefined':
      case 'function':
      case 'symbol': return 'undefined';
      case 'null': return 'null';
      case 'bigint': throw new TypeError('Do not know how to serialize a BigInt');
      case 'array': {
        const result = data.map(item => {
          let res = translate('', item, level+1);
          switch (res) {
            case 'undefined':
              return 'null';
            default:
              return res;
          }
        });
        return formatArray(result, level);
      }
      // case 'object':
      default: {
        if ('toJSON' in data && getType(data['toJSON']) === 'function') {
          // 自有属性或原型属性
          return data.toJSON();
        }
        let res = [];
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // `Object.entries()`方法返回一个给定对象自身可枚举属性的键值对数组(迭代器)，其排列与使用 `for...in` 循环遍历该对象时返回的顺序一致
        // （区别在于 `for-in` 循环还会枚举原型链中的属性）。
        for (let [key, value] of Object.entries(data)) {
          if ('symbol' === getType(key)) {
            continue;
          }
          let tVal = translate(key, value, level+1);
          if ('undefined' === tVal) {
            continue;
          }
          // 对象需要缩进时，tVal前面有一个空格
          res.push(`"${key}":${needBeautify ? ' ' : ''}${tVal}`);
        }
        return formatObject(res, level);
      }
    }
  };
  
  return translate('', data, 0);
}
