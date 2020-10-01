
function genTOC() {
  // 查找TOC容器元素
  // 若不存在，则在文档开头处创建
  let toc = document.getElementById('TOC');
  if (!toc) {
    toc = document.createElement('div');
    toc.id = 'TOC';
    document.body.insertBefore(toc, document.body.firstChild);
  }

  // 查找所有heading元素
  const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');

  // 初始化一个数组来保持跟踪章节号
  const sectionsNumbers = [0, 0, 0, 0, 0, 0];

  // 现在，循环已找到的标题元素
  for (let h=0, len=headings.length; h<len; h++) {
    const heading = headings[h];

    // 跳过在TOC容器中的标题元素
    if (headings.parentNode === toc) continue;

    // 判定标题的级别
    const level = parseInt(heading.tagName.charAt(1));
    if (isNaN(level) || level<1 || level>6) continue;

    // 对于该标题级别增加sectionNumbers对应的数字
    // 重置所有标题比它级别低的数字为零
    sectionsNumbers[level-1] += 1;
    for (let i=level; i<6; i++) {
      sectionsNumbers[i] = 0;
    }

    // 现在，将所有标题级别的章节号组合产生一个章节号，如2.3.1
    const sectNum = sectionsNumbers.slice(0, level).join('.');

    // 为标题级别增加章节号
    // 把数字放在<span>中，使得其可以用样式修饰
    const span = document.createElement('span');
    span.className = `TOCSectNum TOCSectNum-${sectNum}`;
    span.innerHTML = sectNum;
    heading.insertBefore(span, heading.firstChild);

    // 用命名的锚点将标题包起来，以便为它增加链接
    const anchor = document.createElement('a');
    anchor.name = `TOC-${sectNum}`;
    heading.parentNode.insertBefore(anchor, heading);
    anchor.appendChild(heading);

    // 现在为该节点创建一个链接
    const link = document.createElement('a');
    link.href = `#TOC-${sectNum}`;      // 链接的目标地址
    link.innerHTML = heading.innerHTML; // 链接文本与实际标题一致

    // 将链接放在一个div中，div用基于级别名字的样式修饰
    const entry = document.createElement('div');
    entry.className = `TOCEntry TOCLevel-${level}`;
    entry.appendChild(link);

    // 该div添加到TOC容器中
    toc.appendChild(entry);
  }
}

/*

<div id="TOC">
  <div class="TOCEntry TOCLevel-{level}">
    <a href="#TOC-{sectNum}"></a>
  </div>
</div>

<!-- ... -->
<a name="TOC-{sectNum}">
  <h$>
    <span>{sectNum}</span>
    text of H$
  </h$>
</a>


*/

onLoad && onLoad(genTOC);
