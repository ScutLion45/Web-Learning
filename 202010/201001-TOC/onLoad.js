function onLoad (fn) {
  if (onLoad.loaded) {
    window.setTimeout(fn, 0);
  } else if (window.addEventListener) {
    window.addEventListener('load', fn, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', fn);
  }
}

onLoad.loaded = false;
