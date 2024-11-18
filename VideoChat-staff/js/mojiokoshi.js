const bt_click = document.getElementById('event');
//bt_click.style.visibility="hidden"

function GCookies()
{
    //console.log("gcookie");
    let list=[];
    let hoge_key=[];
    let hoge_value=[];
    var r = document.cookie.split(';'); 
    r.forEach(function(value) { 
        var content = value.split('=');
        // console.log(content[0].includes('name'));
        if(content[0].includes('name')){//content[0]!=' autotxt' && content[0]!=' poptext'
            // console.log(content[0]);
            hoge_key.push(content[0]);
            hoge_value.push(content[1]);
            list.push(content[1]);
        }  
    })
    // console.log(list);
    // console.log(hoge_key);
    // console.log(hoge_value);
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
            if(n == 'autotxt' || n==" autotxt" || n.includes('autotxt')){
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
async function speechm(te){
    //content.innerHTML += "test"
    //const ls=["こんにちは","おはよう","漢字"];
    var ls= await GCookies();
    console.log(ls, te);
    if(ls==""){
        return;
    }
    for(let i=0;(i<ls.length);i++){
        for(let m=0;(te.length)>=ls[i].length+m;m++){
            if(te.length<ls[i]){
                console.log(`${te}_:;${ls[i]}`);
                break
            }
            let c = te.slice(m,(ls[i].length+m));
            if(c===ls[i]){
                console.log(`${c}===${ls[i]}::で通知されました`);
                notify(1,ls[i]);//1106:相手の話したことすべてに通知が来るバグ>>誰か対応中はつかわないか
                break
            }
        }
    }
    //content.innerHTML += ls;
    return;
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
