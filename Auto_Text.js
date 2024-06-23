const mytext = document.getElementById('myself');
const roomtext = document.getElementById('roomtext');
let list;
var splitcookie = document.cookie.split(';');
window.addEventListener('message',(e)=>{
    var msg=e.data.msg;
    if(e.data.id=='self'){
        repmsg=msg.replace("☆あなたの文字起こし","");
        htmltxt=mytext.innerText;
        repmsg=repmsg.replace(htmltxt,'');
        mytext.innerHTML+=repmsg+"<br>";
    }else{
        repmsg=msg.replace("☆ルームの文字起こし","");
        htmltxt=roomtext.innerText;
        repmsg=repmsg.replace(htmltxt,'');
        roomtext.innerHTML+=repmsg+"<br>";
    }
})
// splitcookie.forEach(function(value) { 
// //cookie名と値に分ける
//     var content = value.split('=');
//     if(content[0].includes("poptext")){//文字起こしの記録を除外
//         list=content[1];
//         roomtext.innerHTML=list;
//     }else if(content[0].includes("poptext_myself")){
//         list=content[1];
//         mytext.innerHTML=list;
//     }else{
//         console.log(content[1]);
//     } 
// })

cookieStore.addEventListener("change", (event) => {
    let list;
    var splitcookie = document.cookie.split(';');
    splitcookie.forEach(function(value) { 
    //cookie名と値に分ける
        var content = value.split('=');
        if(content[0].includes("poptext")){//文字起こしの記録を除外
            list=content[1];
            roomtext.innerHTML=list;
        }else if(content[0].includes("poptext_myself")){
            list=content[1];
            mytext.innerHTML=list;
        }else{
            console.log( content[1] );
        } 
    })
    //console.log(list);
    console.log(event);
 })