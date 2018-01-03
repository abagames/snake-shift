export function initSeedUi(onSeedChanged: Function) {
  const p = document.createElement('p');
  p.innerHTML = `<button id="change">change</button>
    seed: <input type="number" id="seed" value="0" style="width:80px"></input>
    <button id="set">set</button>`;
  p.style.textAlign = 'left';
  document.getElementsByTagName('body')[0].appendChild(p);
  const changeElm = document.getElementById('change');
  const seedElm = <HTMLInputElement>document.getElementById('seed');
  const setElm = document.getElementById('set');
  changeElm.onclick = function () {
    seedElm.value = Math.floor(Math.random() * 9999999).toString();
    onSeedChanging();
  };
  setElm.onclick = onSeedChanging;
  function onSeedChanging() {
    onSeedChanged(Number(seedElm.value));
  }
}

export function enableShowingErrors() {
  const pre = document.createElement('pre');
  pre.style.textAlign = 'left';
  document.getElementsByTagName('body')[0].appendChild(pre);
  window.addEventListener('error', function (error: any) {
    var message = [error.filename, '@', error.lineno, ':\n', error.message].join('');
    pre.textContent += '\n' + message;
    return false;
  });
}
