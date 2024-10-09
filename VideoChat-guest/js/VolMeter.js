const AudioContext = window.AudioContext || window.webkitAudioContext;
const meter = document.getElementById('volume');
const waveBall = document.querySelector('.wave-ball');
let thresholdTimer = null;
timejudge = false;
const THRESHOLD = 10;
const THRESHOLD_DURATION = 500; //ミリ秒

function render(percent) {
  //-130あたりがデフォルト
  //数値が正になるとメータが動く
  //onsole.log('Percent:', percent);
  // 音量が70を超えた場合、アニメーションを激しくする
  if (percent > THRESHOLD) {
    if (thresholdTimer){
        clearTimeout(thresholdTimer);
        thresholdTimer = null;
    }
    console.log("ima");
    waveBall.classList.add('active');
    timejudge = false;
  } else {
    if (!timejudge){
        timejudge = true;
        thresholdTimer = setTimeout(() => {
            waveBall.classList.remove('active');
            timejudge = false;
        }, THRESHOLD_DURATION)

    }
    
  }
}

function onProcess(event) {
  const data = event.inputBuffer.getChannelData(0);
  const peak = data.reduce((max, sample) => {
    const cur = Math.abs(sample);
    return max > cur ? max : cur;
  });
  render(100 / 12 * 10 * Math.log10(peak) + 100);
}

async function startVoice() {
  const media = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .catch(console.error);
  const ctx = new AudioContext();
  console.log('Sampling Rate:', ctx.sampleRate);

  const processor = ctx.createScriptProcessor(1024, 1, 1);
  processor.onaudioprocess = onProcess;
  processor.connect(ctx.destination);

  const source = ctx.createMediaStreamSource(media);
  source.connect(processor);
}

document.getElementById('js-join-trigger').addEventListener('click', () => {
  console.log('startViceMeter');
  startVoice();
});