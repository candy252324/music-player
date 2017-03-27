
//毫秒转00:00格式
function transformTime(time){
    var higher=parseInt(time/60)<10?("0"+parseInt(time/60)):parseInt(time/60);
    var lower=parseInt(time%60)<10?("0"+parseInt(time%60)):parseInt(time%60);
    return  higher+":"+lower;
}
