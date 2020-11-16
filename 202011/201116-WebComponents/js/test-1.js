// Ref: http://www.ruanyifeng.com/blog/2019/08/web_components.html

class UserCard extends HTMLElement {
  constructor() {
    super();

    // UserCard 的布局信息
    const avatar = document.createElement('img');
    avatar.src = 'img/kristy.png';
    avatar.classList.add('avatar');

    const container = document.createElement('div');
    container.classList.add('container');

    // UserCard 的内容信息
    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = 'User Name';

    const email = document.createElement('p');
    email.classList.add('email');
    email.textContent = 'example@example.com';

    const button = document.createElement('button');
    button.classList.add('follow');
    button.textContent = 'Follow';

    // this 指向 UserCard 实例
    container.append(name, email, button);
    this.append(avatar, container);
  }
}

const userCard = (function () {
  if (window.customElements) {
    window.customElements.define('user-card', UserCard);
    return document.createElement('user-card');
    // index.html:16 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children
  } else {
    let info = document.createElement('p');
    info.textContent = '该浏览器版本不支持 WebComponents API';
    return info;
  }
})();
