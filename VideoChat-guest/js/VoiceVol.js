document.getElementById('js-join-trigger').addEventListener('click', async () => {
    const volumeCanvas = document.getElementById('volumeCanvas');
    // const frequencyCanvas = document.getElementById('frequencyCanvas');
    volumeCanvas.style.visibility="visible";
    const volumeCtx = volumeCanvas.getContext('2d');
    // const frequencyCtx = frequencyCanvas.getContext('2d');
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    
    // GainNodeを作成して減衰量を設定
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 値を小さくすると音量が減衰される
    
    const analyser = audioContext.createAnalyser();
    
    source.connect(gainNode);
    gainNode.connect(analyser); // GainNodeをAnalyserNodeの前に挿入
    
    analyser.fftSize = 2048;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function drawVolume() {
        requestAnimationFrame(drawVolume);
        analyser.getByteTimeDomainData(dataArray);
        
        volumeCtx.fillStyle = 'white';
        volumeCtx.fillRect(0, 0, volumeCanvas.width, volumeCanvas.height);
        
        volumeCtx.lineWidth = 2;
        volumeCtx.strokeStyle = 'black';
        
        volumeCtx.beginPath();
        
        const sliceWidth = volumeCanvas.width * 1.0 / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * volumeCanvas.height / 3; // 値を小さくして波形を縮小
            if (i === 0) {
                volumeCtx.moveTo(x, y);
                console.log('move');
            } else {
                volumeCtx.lineTo(x, y);
                if(Math.round(y) != 50){
                    console.log(Math.round(x),Math.round(y));
                }
            }
            
            x += sliceWidth;
        }
        
        volumeCtx.lineTo(volumeCanvas.width, volumeCanvas.height / 2);
        volumeCtx.stroke();
    }
    
    // function drawFrequency() {
    //     requestAnimationFrame(drawFrequency);
    //     analyser.getByteFrequencyData(dataArray);
        
    //     frequencyCtx.fillStyle = 'white';
    //     frequencyCtx.fillRect(0, 0, frequencyCanvas.width, frequencyCanvas.height);
        
    //     const barWidth = (frequencyCanvas.width / bufferLength) * 2.5;
    //     let x = 0;
        
    //     for (let i = 0; i < bufferLength; i++) {
    //         const barHeight = dataArray[i];
            
    //         frequencyCtx.fillStyle = 'black';
    //         frequencyCtx.fillRect(x, frequencyCanvas.height - barHeight / 3, barWidth, barHeight / 3); // 値を小さくしてバーを縮小
            
    //         x += barWidth + 1;
    //     }
    // }
    
    drawVolume();
    //drawFrequency();
});
