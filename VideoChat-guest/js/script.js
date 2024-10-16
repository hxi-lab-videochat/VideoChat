const Peer = window.Peer;
flg=false;
at=false;
(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  const evc = document.getElementById('event');
  //const atxt = document.getElementById('atxt');
  const roommoji = document.getElementById('menu_roommoji');
  const mymoji=document.getElementById("menu_mymoji");
  const strMyVideo = document.getElementById('strmyvideo');

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();
  
  const getRoomModeByHash = () => (location.hash === '#sfu' ? 'sfu' : 'mesh');
  var expire = new Date();

  roomMode.textContent = getRoomModeByHash();
  window.addEventListener(
    'hashchange',
    () => (roomMode.textContent = getRoomModeByHash())
  );

  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true
    })
    .catch(console.error);

  /*
    async function min() {
      // 表示用のCanvas
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      // 画像処理用のオフスクリーンCanvas
      const offscreen = document.createElement("canvas");
      const offscreenCtx = offscreen.getContext("2d");
      // カメラから映像を取得するためのvideo要素
      const video = document.createElement("video");
    
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
    
      video.srcObject = stream;
      // streamの読み込み完了
      video.onloadedmetadata = () => {
        video.play();
    
        // Canvasのサイズを映像に合わせる
        canvas.width = offscreen.width = video.videoWidth;
        canvas.height = offscreen.height = video.videoHeight;
    
        tick();
      };
    
    
      // 1フレームごとに呼び出される処理
      function tick() {
        // カメラの映像をCanvasに描画する
        filter();
    
    
        // イメージデータを取得する（[r,g,b,a,r,g,b,a,...]のように1次元配列で取得できる）
        const imageData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        // imageData.dataはreadonlyなのでfilterメソッドで直接書き換える
        filter(imageData.data);
    
        // オフスクリーンCanvasを更新する
        offscreenCtx.putImageData(imageData, 0, 0);
    
        // 表示用Canvasに描画する
        ctx.drawImage(offscreen, 0, 0);
    
        // 次フレームを処理する
        window.requestAnimationFrame(tick);
      }
    
      function filter(data) {
        // 画像処理を行う
        offscreenCtx.translate( 640, 0 );
        offscreenCtx.scale( -1, 1 );
        offscreenCtx.drawImage(video, 0, 0);
      }
    
      
    }

  min();
  */


  function toggleCamera() {
    const videoTracks = localStream.getVideoTracks();
    const cameraButton = document.getElementById("camera-button");
    const cameraImage = document.querySelector("#camera-button img");
  
    if (videoTracks.length > 0 && videoTracks[0].enabled) {
      videoTracks.forEach(ctrack => ctrack.enabled = false);
      cameraImage.src = "img/Ban.png";
    } else {
      videoTracks.forEach(ctrack => ctrack.enabled = true);
      cameraImage.src = "img/camera.png";
    }
  }
  
  const cameraButton = document.getElementById("camera-button");
  cameraButton.addEventListener('click', toggleCamera);


  function toggleMic() {
    const audioTracks = localStream.getAudioTracks();
    const micButton = document.getElementById("mic-button");
    const micImage = document.querySelector("#mic-button img");
  
    if (audioTracks.length > 0 && audioTracks[0].enabled) {
      audioTracks.forEach(mtrack => mtrack.enabled = false);
      micImage.src = "img/muted.png";
      f_mute()
    } else {
      audioTracks.forEach(mtrack => mtrack.enabled = true);
      micImage.src = "img/mic.png";
      f_mute()
    }
  }
  
  const micButton = document.getElementById("mic-button");
  micButton.addEventListener('click', toggleMic);

  

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);


  // eslint-disable-next-line require-atomic-updates
  const peer = (window.peer = new Peer({
    key: 'f810ebbb-3b29-4ebc-ae3c-d58c967be2e3',
    debug: 3,
  }));
  // var streamname;
  // function tryGetNeme(str){
  //   streamname=str;
  //   console.log(streamname);
  // }
  // Register join handler
  joinTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }
    
    //ここif_12/14
    if(flg){
      return;
    }
    flg=true;
    
    var check_type=Object.prototype.toString;

    const room = peer.joinRoom("roomId_2", {
      //roomId.valueが元値
      mode: getRoomModeByHash(),
      stream: localStream,
    });
    try{
      var uname=location.href.split("=")[1];
      var decode_name=decodeURI(uname);
      console.log(decode_name);
      decode_name+='_Guest';
    }catch(e){
        var decode_name="no name";
        console.log(e);
    }
    uname='hoge'+decode_name;
    //strMyVideo.innerHTML=decode_name;
    strMyVideo.style.zIndex=10;
    strMyVideo.style.position="absolute";
    strMyVideo.style.color="white";
    var notifyname = {pn:"username",msg:decode_name};
    var joinname = {pn:"joinuser",msg:decode_name,prid:""};

    //自分が参加したとき
    room.once('open',async () => {
      messages.textContent += '=== 参加しました ===\n';
      peer.listAllPeers((peers) => {
        console.log(peers);
        console.log('myid is '+peers[peers.length-1]);
        joinname.prid=peers[peers.length-1]
        joinuser(decode_name,peers[peers.length-1])
      });
      await room.send(notifyname);
    });
    //他者が参加してきたとき
    room.on('peerJoin',async peerId => {
      messages.textContent += `=== 参加しました! ===\n`;
      await console.log("ピアIDは:"+peerId);
      // await pid(peerId);
      // console.log(joinname);
      joinname.prid=peerId
      //room.send(joinname);
      //room.send(notifyname);
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const remoteStream = document.createElement('div');
      remoteStream.style.position="relative";
      remoteStream.setAttribute('streamId',stream.peerId);
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      console.log(stream.peerId);
      // mark peerId to find it later at peerLeave event 退出ユーザの識別
      newVideo.setAttribute('data-peer-id', stream.peerId);
      //ビデオ要素の上から要素を表示したい
      const strName = document.createElement('div');
      strName.setAttribute('userName',stream.peerId);
      strName.innerHTML='username';
      strName.style.position="absolute";
      strName.style.color="white";
      newVideo.style.top=100;
      strName.style.zIndex=10;
      remoteStream.append(strName);
      remoteStream.append(newVideo);
      //remoteVideos.append(newVideo);
      const boxContent = document.querySelector('.box.content .remote-streams');
      // remoteStreamをboxContentに追加
      if (boxContent) {
        boxContent.append(remoteStream);
      } else {
        console.error("ccc");
      }
      await newVideo.play().catch(console.error);
    });

    room.on('data', async ({ data, src }) => {
      // Show a message sent to the room and who sent　部屋に送られたメッセージと送信者を表示する
      // var user={}
      if(typeof(data)=="object"){
        if(data.pn=='username'){
          notify(0,data.msg+"がルームに参加しました");//通知をする
          try{
            //console.log("hog+"+data.msg);
            peer.listAllPeers(async(peers) => {
              //console.log(peers);
              console.log(data.msg+'@id is '+peers[peers.length-1]);
              await room.send(joinuser(data.msg,peers[peers.length-1]));
              const userlst=joinuser(null,null).users;
              await Object.keys(userlst).forEach(async(id) => {
                console.log(id,userlst[id])
                var addName= await remoteVideos.querySelector(`[userName="${id}"]`);
                try{
                  addName.innerHTML=await userlst[id];
                }catch(e){
                  console.log(e);
                  console.log(`peerid:${id},username:${userlst[id]}`);
                }
               });
            });
          }catch(e){
            console.log(e)
          }
          return
        }else if(data.pn=="joinuser"){
          var key=data.msg;//名前をキーにする
          try{
            console.log(data);
            await updateUser(data);
            const userlst=joinuser(null,null).users;
            await Object.keys(userlst).forEach(async(id) => {
              console.log(id,userlst[id])
              var addName= await remoteVideos.querySelector(`[userName="${id}"]`);
              try{
                addName.innerHTML=await userlst[id];
              }catch(e){
                console.log(e);
                console.log(`peerid:${id},username:${userlst[id]}`);
              }
             })
          }catch(e){
            console.log(e);
          }
          return
        }else if(data.pn=='raisehand' || data.pn=='lowerhand'){
          console.log(data.pn);
          return;
        }else if(data.pn=="guestSignOut"){
          console.log(String(data.msg));
          leaveTrigger.click();
          return;
        }else{
        console.log(atxt);
        roommoji.innerHTML += '<div>'+ String(data.msg) +'</div>';
        speechm(String(data.msg));
        // let moji_container=document.getElementById("mojiokoshi_container");
        // moji_container.scrollTo(0,moji_container.scrollHeight)
        return
      }
    }
      var user = data.split(":");
      if(user.length==1){
        messages.textContent +=`${user}\n`
      }else{
        messages.textContent += `${user[0]}: ${cut(user[1])}\n`;
      }
      let target = document.getElementById('js-messages');
      target.scrollTo(0,target.scrollHeight);
    });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      const userName = remoteVideos.querySelector(
        `[userName="${peerId}"]`
      );
      //console.log(peerId);
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();
      userName.srcObject = null;
      userName.remove();
      removeUser(peerId);
      messages.textContent += `=== ${"2"}退出しました ===\n`;
      messages.textContent = null;
      roommoji.innerHTML="ルームの文字起こし";
      mymoji.innerHTML="あなたの文字起こし";
    });
    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== 退出しました ===\n';
      messages.textContent = null;
      // Array.from(remoteVideos.children).forEach(remoteVideo => {
      //   remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      //   remoteVideo.srcObject = null;
      //   remoteVideo.remove();
      // });
      location.href="top.html"
      clearUser();
    });

    //--dataConnection-
    /*
    const conn = peer.connect(peerId);
    conn.on("data",(data)=>{
        console.log(data);
    });
    conn.send(nw_data);
    */

    evc.addEventListener('click',clg);
    sendTrigger.addEventListener('click', onClickSend);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });


    function onClickSend() {
      // Send message to all of the peers in the room via websocket WebSocket経由でルーム内のすべてのピアにメッセージを送信する
      //ここif_12/14
      if(localText.value==""){
        alert("No input");
        return;
      }
      var s_msg=userm()+":"+localText.value;/*`${userm()}:${localText.value}`;*/
      room.send(s_msg);
      messages.textContent += `${userm()}: ${cut(localText.value)}\n`;
      localText.value = '';
      let target = document.getElementById('js-messages');
      target.scrollTo(0,target.scrollHeight);
    }

    function clg(){
      var automsg=autotxtcookie();
      var autotxt = {pn:"mojiokoshi",msg:userm()+';'+automsg};
      room.send(autotxt)
    }

    const raisehand = document.getElementById('raisehand');
// 挙手ボタンイベント
    raisehand.addEventListener('click', () => {
      localText.value = '';
      room.send({ pn: 'raisehand', msg: peer.id });
      messages.textContent += '==対応に向かいます==\n';
      let target = document.getElementById('js-messages');
      target.scrollTo(0, target.scrollHeight);
      //console.log('挙手したユーザーのPeerID:', peer.id);
    });

    room.on('data', async ({ data, src }) => {
      if (data.pn === 'raisehand') {
        const targetpeerId = data.msg;
        console.log('挙手したユーザーのPeerID:', targetpeerId);
        //var cv = document.querySelectorAll('.content video');
        document.querySelectorAll('.content video').forEach(video => {
          console.log('aaaa')
          video.style.visibility = 'hidden';
        });
        const targetVideo = remoteVideos.querySelector(`[data-peer-id="${targetpeerId}"]`);


        if (targetVideo) {
          console.log(targetVideo)
          
          targetVideo.style.visibility = 'visible';

          // 他のユーザーのビデオトラックを無効にする
          peer.listAllPeers((peers) => {
            peers.forEach(peerId => {
              if (peerId !== targetpeerId) {
                const otherVideo = remoteVideos.querySelector(`[data-peer-id="${peerId}"]`);
                if (otherVideo) {
                  otherVideo.srcObject.getTracks().forEach(track => track.enabled = false);
                }
              }
            });
          });
        }
      }

      if (data.pn === 'lowerhand') {
        const targetpeerId = data.msg;
        console.log('手を下げたユーザーのPeerID:', targetpeerId);
        var cv = document.querySelectorAll('.content video');
        // 最初のCSSスタイル書き換え
        cv.forEach(cv => {
          cv.style.visibility = 'hidden';
        });

        peer.listAllPeers((peers) => {
          console.log(peers);
          const mypeer = peer.id; // 自身のPeerIDを取得
          peers.forEach(peerId => {
            if (peerId !== targetpeerId && peerId !== mypeer) {
              const remoteVideo = remoteVideos.querySelector(`[data-peer-id="${peerId}"]`);
              if (remoteVideo) {
                remoteVideo.srcObject.getTracks().forEach(track => track.enabled = true);
              }
              console.log(peerId);
            }
          });
        });
      }
    });

  });
  peer.on('error', console.error);
})();