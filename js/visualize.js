 function visualization(){
    try {
        var audioCtx = new (window.AudioContext ||window.webkitAudioContext)();
    } catch (err) {
        alert('!Your browser does not support Web Audio API!');
    };
    var myCanvas = document.getElementById('myCanvas');  //创建音频环境（audio Context）
        canvasCtx = myCanvas.getContext("2d");

        source = audioCtx.createMediaElementSource(audio);   //创建音源
        analyser = audioCtx.createAnalyser();    // 创建音频分析节点

    source.connect(analyser);   //音源连接到分析节点
    analyser.connect(audioCtx.destination);  // 分析节点连接到AudioDestinationNode对象（AudioDestinationNode是音频输出聚集地，所有的Audio都直接或间接连接到这里）

    meterWidth=3;
    gap=2;
    meterNum=64;


    function draw () {
        var cwidth = myCanvas.width,
            cheight = myCanvas.height,
            array = new Uint8Array(analyser.frequencyBinCount);  // array是音频频域数据， 长度1024，此时每个值都为0，

        analyser.getByteFrequencyData(array);  //将array绑定到分析节点，获取频域数据, arr[i]的值间接决定柱子高度,arr[i]最大值为255
        
        var step = Math.round(array.length / meterNum);  

        canvasCtx.clearRect(0, 0, cwidth, cheight);


        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step]   //value最大值为255
            value *= (cheight/255)*0.9;   //使柱子高度不超过canvas容器的0.9
            canvasCtx.fillRect(i * (meterWidth+gap),  cheight - value, meterWidth, value);
        }
        requestAnimationFrame(draw);
    };
    draw ()
}

       