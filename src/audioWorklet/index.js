import p5sound from '../main.js';
const moduleSources = [
  '/scripts/libs/amplitudeProcessor.js',
  '/scripts/libs/recorderProcessor.js',
  '/scripts/libs/soundFileProcessor.js',
];
const ac = p5sound.audiocontext;
let initializedAudioWorklets = false;

function loadAudioWorkletModules() {
  return Promise.all(
    moduleSources.map(function (moduleSrc) {
      return ac.audioWorklet.addModule(moduleSrc);
    })
  );
}

p5.prototype.registerMethod('init', function () {
  if (initializedAudioWorklets) return;
  // ensure that a preload function exists so that p5 will wait for preloads to finish
  if (!this.preload && !window.preload) {
    this.preload = function () {};
  }

  // use p5's preload system to load necessary AudioWorklet modules before setup()
  this._incrementPreload();
  const onWorkletModulesLoad = function () {
    initializedAudioWorklets = true;
    this._decrementPreload();
  }.bind(this);
  loadAudioWorkletModules().then(onWorkletModulesLoad);
});
