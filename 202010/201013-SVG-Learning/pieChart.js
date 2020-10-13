/**
 * 创建一个<svg>元素，并在其中绘制一个饼状图（pieChart）
 * @params (解构后)
 *   data: number[]; 用户绘制的数据数组，数组的每一项都表示饼状图的一个楔；
 *   width, height: number; SVG图形的大小，单位为像素；
 *   cx, cy, r: number; 饼状图的圆心以及半径；
 *   color: string[]; 一个包含HTML颜色信息的数组，每种颜色按顺序表示饼状图每个楔的颜色；
 *   legend: string[]; 一个图例数组，每个元素按顺序表示饼状图每个楔所代表的含义；
 *   lx, ly: number; 饼状图相对于SVG图形的左上角坐标；
 * @returns
 *   一个保存饼状图的<svg>元素
 *   调用者应将返回的元素插入文档中
 */

function pieChart({
  data, width, height, cx, cy, r, color, legend, lx, ly
}) {
  // svg元素的命名空间
  const svgns = 'http://www.w3.org/2000/svg';

  // 创建一个<svg>元素，同时指定像素级大小和用户坐标
  const chart = document.createElementNS(svgns, 'svg:svg');
  chart.setAttribute('width', width);
  chart.setAttribute('height', height);
  chart.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // 累加data的值，以便于知道饼状图的大小
  const total = data.reduce((x,y)=>x+y);
  console.log('total', total);

  // 计算出饼状图每个楔的大小（扇形角度），其中角度以弧度制计算
  let tmp = total / Math.PI / 2;
  const angle = data.map(d => d / tmp);
  console.log('angle', angle);

  // 遍历饼状图的每个楔
  let startAngle = 0;
  for (let i=0, len=data.length; i<len; i++) {
    // 表示楔的结束位置
    const endAngle = startAngle + angle[i];

    // 计算出楔和圆相交的两个点
    // 这些计算公式都是以12点钟方向为0°
    // 顺时针方向角度递增
    const x1 = cx + r * Math.sin(startAngle);
    const y1 = cy - r * Math.cos(startAngle);
    const x2 = cx + r * Math.sin(endAngle);
    const y2 = cy - r * Math.cos(endAngle);

    // 这个标记表示角度大于半圆
    // 此标记在绘制SVG弧形组件时需要
    const big = (endAngle - startAngle) > Math.PI ? 1 : 0;

    // 使用<svg:path>元素来描述楔
    const path = document.createElementNS(svgns, 'path');

    // 以下字符串包含路径的详细信息
    const d = `M ${cx},${cy}`    // 从圆心(cx,cy)开始
              + ` L ${x1},${y1}` // 画一条到(x1, y1)的线段
              + ` A ${r},${r}`   // 再画一条半径为r的弧
              + ` 0 ${big} 1 `    // 弧的详细信息
              + `${x2},${y2}`    // 弧到(x2,y2)结束
              + ' Z';             // 当前路径回到(cx,cy)结束

    // 设置<svg:path>的属性
    path.setAttribute('d', d);
    path.setAttribute('fill', color[i]);
    path.setAttribute('stroke', '#333');
    path.setAttribute('stroke-width', '2');
    // 添加到chart
    chart.appendChild(path);

    // 当前楔的结束是下一个楔的开始
    startAngle = endAngle;

    // 绘制相应的方块表示图例icon
    const icon = document.createElementNS(svgns, 'rect');
    icon.setAttribute('x', lx);
    icon.setAttribute('y', ly + 30 * i - 30);
    icon.setAttribute('width', 20);
    icon.setAttribute('height', 20);
    icon.setAttribute('fill', color[i]);
    icon.setAttribute('stroke', '#333');
    icon.setAttribute('stroke-width', '2');
    // 添加到chart
    chart.appendChild(icon);

    // 在方块右边添加标签
    const label = document.createElementNS(svgns, 'text');
    label.setAttribute('x', lx + 30);
    label.setAttribute('y', ly + 30 * i + 15 - 30);
    // 通过CSS设置文本样式
    label.setAttribute('font-family', 'sans-serif');
    label.setAttribute('font-size', '16');
    // 在<svg:text>元素中添加一个DOM文本节点
    label.appendChild(document.createTextNode(legend[i]));
    // 添加到chart
    chart.appendChild(label);
  }

  return chart;
}