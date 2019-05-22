// piece object
const piece = (function() {
  let el = null;

  const init = function(el) {
    this.el = el;
    this.initialPosition = {
      left: this.el.getBoundingClientRect().left,
      top: this.el.getBoundingClientRect().top
    };
  };

  const moveDelta = function(dx, dy, isRandom) {
    const documentHeight = document.documentElement.scrollHeight;
    const documentWidth = document.documentElement.scrollWidth;
    const pos = this.el.getBoundingClientRect();
    if (
      (!isRandom &&
        (dy + pos.top >= documentHeight - 100 || dy + pos.top < 0)) ||
      (!isRandom && (dx + pos.left >= documentWidth - 100 || dx + pos.left < 0))
    ) {
      return;
    }

    if (dy >= documentHeight) {
      dy = dy - documentHeight - 250;
    }
    if (dx >= documentWidth) {
      dx = dx - documentWidth - 250;
    }
    this.el.style.left = isRandom ? `${dx}px` : `${pos.left + dx}px`;
    this.el.style.top = isRandom ? `${dy}px` : `${pos.top + dy}px`;
  };
  return {
    init,
    moveDelta
  };
})();

function handleClick(ev) {
  piece.moveDelta(parseInt(this.dataset.dx), parseInt(this.dataset.dy));
}

function reset() {
  piece.el.style.left = `${piece.initialPosition.left}px`;
  piece.el.style.top = `${piece.initialPosition.top}px`;
}

function randomize() {
  const randomX = Math.round(Math.random() * 1000);
  const randomY = Math.round(Math.random() * 1000);

  piece.moveDelta(randomX, randomY, true);
}

function getTemperture() {
  const currentTemperture = JSON.parse(this.responseText).current.temp_c;

  if (currentTemperture <= 10) {
    piece.el.style.backgroundColor = 'blue';
    piece.el.style.borderColor = 'blue';
  } else if (currentTemperture > 10 && currentTemperture <= 20) {
    piece.el.style.backgroundColor = 'green';
    piece.el.style.borderColor = 'green';
  } else if (currentTemperture > 21 && currentTemperture <= 30) {
    piece.el.style.backgroundColor = 'yellow';
    piece.el.style.borderColor = 'yellow';
  } else {
    piece.el.style.backgroundColor = 'red';
    piece.el.style.borderColor = 'red';
  }
}

function addListener(name, x, y) {
  const $btn = document.getElementById(name);
  $btn.dataset.dx = x;
  $btn.dataset.dy = y;
  $btn.addEventListener('click', handleClick);
}

function init() {
  const tempReq = new XMLHttpRequest();
  tempReq.addEventListener('load', getTemperture);
  tempReq.open(
    'GET',
    'http://api.apixu.com/v1/current.json?key=dda6e762ae4f41efb7e173552192204&q=tel%20aviv'
  );
  tempReq.send();

  const $reset = document.getElementById('reset');
  $reset.addEventListener('click', reset);

  const $randomize = document.getElementById('randomize');
  $randomize.addEventListener('click', randomize);

  addListener('btn-up', 0, -100);
  addListener('btn-right', 100, 0);
  addListener('btn-down', 0, 100);
  addListener('btn-left', -100, 0);
}

window.addEventListener('DOMContentLoaded', event => {
  piece.init(document.getElementById('piece'));
  init();
});
