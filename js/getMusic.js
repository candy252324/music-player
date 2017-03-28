
var audio=$("audio")[0],
    duration,
    curTime,
    volume,
    timeList=[];



//播放与暂停
$(".toggle").on("click",function(){
    if(audio.paused){
        audio.play();
        Int=setInterval(clock,500)
        $(".control .toggle").addClass("active")
      
    }else{
        audio.pause();
        clearInterval(Int);
        $(".control .toggle").removeClass("active")
    }
})


var Int=setInterval(clock,300)

function clock(){
    setLyricAnimation()   //设置歌词动画及样式
    getTime();   //动态显示播放时间
    $(".range .progress").css({
        "width":curTime*cwidth/duration
    })
    if(curTime==duration){  //自动播放下一首
        $(".toggle").removeClass("active")
        getSong();
    }
}

//是否循环播放
$(".cycle").on("click",function(){
    if(audio.loop){
        $("audio").removeAttr('loop');
        $(".cycle").removeClass("active")
      
    }else{
        $("audio").attr("loop","loop");
        $(".cycle").addClass("active")
    }
})


// 是否显示歌词
$(".lyric-toggle").on("click",function(){
    $(".lyric-wrap").toggleClass('active');
})

//下一首
$(".forward").on("click",function(){
    getSong();
})

//改变频道
$(".change-channel").on("click",function(){
    getChannel();
})


//控制杆改变音乐进度
var cwidth=$(".range").width();
$(".range").on("click",function(e){
    var val=e.offsetX;
    // var val=$(this).val()
    curTime=audio.currentTime=duration*val/cwidth;
    $(".range .progress").css({
        "width":val
    })
})


//改变音量
volume=$(".volume-handle").val()/100;
audio.volume=volume;

$(".volume").on("click",function(){
    if(audio.volume){
        audio.volume=0;
        $(".volume").removeClass("active")
        $(".volume-handle").val(0);

    }else{
        audio.volume=volume;
        $(".volume").addClass("active")
        $(".volume-handle").val(volume*100);
        
    }
})

$(".volume-handle").on("change",function(){
    volume=$(this).val()/100;
    audio.volume=volume;
})

$(".like").on("click", "i" ,function(){
    $(this).toggleClass('active');
})



function getTime(){

    duration=audio.duration; 
    curTime=audio.currentTime;

    if(!isNaN(duration)){
        $(".time .duration").text(transformTime(duration));
        $(".time .curTime").text(transformTime(curTime));
    } 
   
}


function getChannel(){
    var idx,
        len;
    $.ajax({
        url:'http://api.jirengu.com/fm/getChannels.php',
        type: 'GET',
        dataType: 'json', 
        success:function(res){
            len=res.channels.length;
            idx=Math.floor(Math.random()*len);
            curChannel=res.channels[idx].channel_id;


            $(".channel").text(res.channels[idx].name);
            getSong(curChannel);   
            
        },
        error:function(){
             console.log("系统错误！");
        }
    })
   
}


//获取当前频道下的歌曲
function getSong(curChannel){

    $(".lyric").empty();
    timeList.length=0;
    curTime=audio.currentTime;

    $.ajax({
        url: 'http://api.jirengu.com/fm/getSong.php',
        type: 'GET',
        dataType: 'json', 
        data: {
            channel:curChannel,
        },
        success:function(res){
            var songInfo=res.song[0];
            var title=songInfo.title,
                sid=songInfo.sid,
                artist=songInfo.artist,
                url=songInfo.url,
                picUrl=songInfo.picture;
            var obj={title:title, sid:sid, artist:artist, url:url, picUrl:picUrl}

            $("audio").attr("src",url);

            playMusic();
            placeItem(obj);  //将当前歌曲信息放置到页面上
            getLyric(sid);  //获取当前歌曲的歌词

        },
        error:function(){
             console.log("获取歌曲失败！");
        }
    })
}

function playMusic() {
    audio.play();
    // visualization()
}

function placeItem(obj){
    $(".img-ct").empty();
    $(".info .title").text(obj.title)
    $(".info .artist").text(obj.artist)
    $(".img-ct").attr("style","background: url("+obj.picUrl+")")
}

function getLyric(sid){
    var lyric;
    $.ajax({
        url: 'http://api.jirengu.com/fm/getLyric.php',
        type: 'GET',
        dataType: 'json', 
        data: {
            sid:sid
        },
        success:function(res){
            lyric=res.lyric;
            placeLyric(lyric);   //放置歌词
        },
        error:function(){
           $(".lyric").append("<li>该歌曲暂无歌词</li>");
            console.log("获取歌词失败");
        }
    })

}

function placeLyric(lyric){
    lyric=lyric.split("\n") 
    for(var i=0; i<lyric.length; i++){
        time=lyric[i].match(/\[\d{2}:\d{2}.\d{2}\]/);
        line=lyric[i].replace(/\[.*?\]/g, "").replace(/\[/g,"").replace(/\]/g,"");  //去除[al:]等杂乱字符 

        var lineSeconds; 
        if(time){  //并非歌词前都有对应时间
            var time=time[0].replace("[", "").replace("]",""),   //"00:00:00"
                minute=time.match(/\d{2}/)[0],
                seconds=time.replace(/\d{2}/,"").match(/\d{2}.\d{2}/)[0];

            lineSeconds=parseFloat(60*minute)+parseFloat(seconds);
            
        }
        timeList.push(lineSeconds);
        $(".lyric").append("<li data-time="+lineSeconds+">"+line+"</li>");
         $(".lyric li").eq(0).addClass("active");
    }
}

//设置歌词动画及样式

function setLyricAnimation(){ 

    for(var i=0; i<timeList.length; i++){ 

        if(timeList[i]<=curTime&&curTime<=timeList[i+1]){
            if($(".lyric li").eq(i).html()){  //li标签必须有内容
                
                $(".lyric li").removeClass("active");
                $(".lyric li").eq(i).addClass("active");

                var liH=$(".lyric li").eq(i).outerHeight(true);
                $(".lyric").css({
                    "margin-top": "-"+liH*i+"px",
                })
                
                break;
            }
        }
    }
}


$(document).ready(getChannel())















      







