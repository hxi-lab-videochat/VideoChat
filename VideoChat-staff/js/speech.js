var flg_mute=true;
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';
try{
    var data2=location.href.split("=")[1];
    var lu_name=decodeURI(data2);
}catch(e){
    var lu_name="no name";
}      
const btn = document.getElementById('btn');
const content = document.getElementById('content');
const mymoji = document.getElementById('menu_mymoji');
var moji_location="../Auto_Text.html?"+"rid="+lu_name;
var newWindow = window.open(moji_location,'_blank','top=100,left=100,width=700,height=500');
if( newWindow ) {
    console.log('正常に開きました');
    }
    else {
    console.log('正常に開けませんでした！');
    newWindow.close();
}
btn.addEventListener('click' , function() {
    // 音声認識をスタート
    console.log("start");
    speech.start();
});
          
//---------------追記---------------//
//音声自動文字起こし機能

speech.onresult = function(e) {
    speech.stop();
    if(e.results[0].isFinal){
        var autotext =  e.results[0][0].transcript
        var expire = new Date();
        expire.setTime( expire.getTime() + 1000 * 3600 * 24*365 );
        console.log(e);
        if(flg_mute){
            mymoji.innerHTML += '<div>'+ userm()+";"+autotext +'</div>';
            postmsg(mymoji.innerText,'self');
            //window.postMessage(mymoji.innerText);
        }else{
            console.log('hoge');
        }
        //speechm(autotext);
        document.cookie = "autotxt="+autotext+'; expires=' + expire.toUTCString();
        if(flg_mute){
            ev_click();
        }else{
            console.log('moge');
        }        
    }
}
              
          
speech.onend = () => { 
speech.start() 
};
//--------------------------------//
//文字起こしを始める関数
function start_speech(){
    console.log("start_byfunc");
    speech.start();
}

function f_mute(){
    if(flg_mute){
        flg_mute=false;
    }else{
        flg_mute=true;
    }
}

// function stop_speech(){
//     console.log("stop_byfunc");
//     speech.stop();
// }

function postmsg(msg,user){
    msgdata={
        id:user,
        msg:msg
    }
    newWindow.postMessage(msgdata);
}