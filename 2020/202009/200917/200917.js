// --------------------------------------------------
const div1 = document.querySelector('div#div1');
div1.onclick = function (event) {
  console.log('div1[onclick]', event.eventPhase);
};
div1.addEventListener('click', function (event) {
  console.log('div1', event.eventPhase, event.target === this);
}, true);

// --------------------------------------------------
const div2 = document.querySelector('div#div2');
div2.addEventListener('click', function (event) {
  console.log('div2', event.eventPhase, event.target === this);
}, false);

// --------------------------------------------------
const btn = document.querySelector('button');
btn.addEventListener('click', function (event) {
  console.log('btn', event.eventPhase, event.target === this);
  // event.stopPropagation();
}, false);

btn.click();
