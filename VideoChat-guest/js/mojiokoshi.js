const bt_click = document.getElementById('event');
//bt_click.style.visibility="hidden"

function GCookies()
{
    //console.log("gcookie");
    let list=[];
    var r = document.cookie.split(';'); 
    r.forEach(function(value) { 
        var content = value.split('=');
        list.push( content[1] );
    })
    return list;
}

function autotxtcookie(){
        //console.log("gcookie");
        let list_name=[];
        let list_data=[];
        var k=0;
        var atx="";
        var r = document.cookie.split(';'); 
        var p="autotxt";
        r.forEach(function(value) { 
            var content = value.split('=');
            list_name.push(content[0]);
            list_data.push(content[1]);
        })
        document.cookie= 'autotxt=nodata; max-age=1;'
        console.log(list_name);
        console.log(list_data);
        for(n of list_name){
            //console.log(n);
            if(n == 'autotxt' || n==" autotxt"){
                console.log(n);
                break;
            }
            k++;
        }
        atx=list_data[k];
        //console.log(k);
        return atx;
}


//語句があれば通知
function speechm(te){
    //content.innerHTML += "test"
    //const ls=["こんにちは","おはよう","漢字"];
    var ls=GCookies();
    console.log(ls,te);
    if(ls==""){
        return;
    }
    for(let i=0;(i<ls.length);i++){
        for(let m=0;(te.length)>=ls[i].length+m;m++){
            if(te.length<ls[i]){
                break
            }
            let c = te.slice(m,(ls[i].length+m));
            if(c==ls[i]){
                notify(1,c);
                break
            }
        }
    }
    //content.innerHTML += ls;
}

function ev_click(){
    console.log("play_ev_click");
    bt_click.click();
}
/* 

ev.onclick=autotxtsend;
*/
//room.send()で受け渡し可能かと思われる。文字起こしのtextが確定したタイミングで他のピアに対してtextを受け渡し判定し、
//通知が発生するようにする。komento
