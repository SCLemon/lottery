window.onload=function(){
    const vm = new Vue({
        el:"#app",
        data:{
            mission:[],
            remain:0,
            point:0,
            prize:{},
            history:[],
            commodity:[],
            FirstTimeFlag:0,
            remainPlay:1,
            showAutoBtn:false,
            changeEnabled:false,
            autoEnabled:false,
            openID:0
        },
        methods:{
            getPrize(){ // 完成實作
                var refresh = document.getElementById("refresh")
                const url='https://script.google.com/macros/s/AKfycbyQpaMQ7qdN7ZvyxvKaIJs9CeHZcxYmUlQ2iPOyJCO0IH0NwAD524gPWovEw3ncxGgX/exec';
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.point =resp.point;
                    this.prize =resp.prize;
                    refresh.classList.remove("fa-spin");
                    draw(this.prize);
                })
            },
            getStatus(){ // 完成實作
                const url = 'https://script.google.com/macros/s/AKfycbwyHnA3Pk9W9iw_4Nt9fDTnmuRtKhqPqCBAOA-VsRT4fE3nvpMMO18-fICvLPEhC7-pOg/exec';
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.remain=resp.remain;
                    this.mission=resp.mission;
                    this.point=resp.point;
                })
            },
            submit(id){ // 完成實作
                var btn = document.getElementsByClassName("btn")[id-1];
                if(confirm("確認發送？")){
                    btn.innerText="發送中";
                    const url = 'https://script.google.com/macros/s/AKfycbwyHnA3Pk9W9iw_4Nt9fDTnmuRtKhqPqCBAOA-VsRT4fE3nvpMMO18-fICvLPEhC7-pOg/exec';
                    var formData=new FormData();
                    formData.append("id",id);
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=="success"){
                            alert("發送成功")
                            btn.innerText="已完成";
                            this.getStatus();
                        }
                        else{
                            alert("發送失敗")
                            btn.innerText="重新嘗試";
                        }
                    })
                }
            },
            scratch(){  // 完成實作
                const url='https://script.google.com/macros/s/AKfycbyQpaMQ7qdN7ZvyxvKaIJs9CeHZcxYmUlQ2iPOyJCO0IH0NwAD524gPWovEw3ncxGgX/exec';
                var formData=new FormData();
                formData.append("id",this.prize.id);
                formData.append("title",this.prize.title);
                formData.append("content",this.prize.content)
                var config={
                    method:"post",
                    body:formData,
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.text())
                .then(resp=>{
                    this.getHistory();
                })
            },
            changePrize(){ // 完成實作
                if(confirm("刷新刮刮卡？")){
                    this.changeEnabled=false;
                    this.FirstTimeFlag=0;
                    var refresh = document.getElementById("refresh");
                    refresh.classList.add("fa-spin");
                    this.getPrize();
                    this.getStatus();
                }
            },
            autoScratch(){ // 完成實作
                if(vm.remain<=0)
                    alert("剩餘次數不足！")
                else if(confirm("確認刮開？")){
                    this.autoEnabled=false;
                    this.scratch();
                    var canvas = document.getElementById("canvas");
                    var bbx = canvas.getBoundingClientRect(); // 避免失真
                    var ctx = canvas.getContext("2d");
                    var cx=-20;
                    var cy=0;
                    const timer = setInterval(function(){
                        var w = 25;	
                        var h = 25;
                        cx+=25;
                        var x = (cx)*(canvas.width/bbx.width); 
                        var y = (cy)*(canvas.height/bbx.height);
                        if(x>300) {
                            cx=-20;
                            cy+=50;
                        }
                        if(y>155) clearInterval(timer)
                        ctx.clearRect(x,y,w,h);
                    },60)       
                }
            },
            getHistory(){ // 完成實作
                const url='https://script.google.com/macros/s/AKfycbyjFrond2ynqVgfhg8CoD0mggYMgZ-2qnqCdEnHNZlm6wFHc-_v6Yy2FonLySQQUGgo/exec'
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.history = resp;
                })
            },
            getCommodity(){ // 完成實作
                const url='https://script.google.com/macros/s/AKfycbwE-a9k3Iwal4V5sVqyv4FIbW678kUeA5HsV4_A2NXg-ZckjDnylk44FjX7apCiNGP7/exec'
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.commodity = resp;
                })
            },
            exchange(id,content,price){ // 完成實作
                var sd = document.getElementsByClassName('send')[id-1];
                if(confirm('確認兌換？')){
                    sd.innerText='傳送中～'
                    const url='https://script.google.com/macros/s/AKfycbwE-a9k3Iwal4V5sVqyv4FIbW678kUeA5HsV4_A2NXg-ZckjDnylk44FjX7apCiNGP7/exec';
                    var formData=new FormData();
                    formData.append("content",content);
                    formData.append("price",price)
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=='failed') {
                            alert('兌換失敗');
                            sd.innerText='兌換失敗'
                        }
                        else{
                            sd.innerText='兌換成功'
                            alert("兌換成功")
                            this.point=resp;
                        }
                    })
                }
            },
            openList(){
                var barList =document.getElementById("bl");
                var bars =document.getElementById("bars");
                barList.classList.toggle('showBl')
                bars.classList.toggle("showB");
            },
            openFrame(openID){ // 完成實作
                var barList =document.getElementById("bl");
                var bars =document.getElementById("bars");
                barList.classList.remove('showBl')
                bars.classList.remove("showB");
                this.openID=openID;
            },
            closeFrame(openID){ // 完成實作
                this.openID=openID;
            },
            alert(msg){
                alert(msg);
            }
        }
    })
    function draw(prize){ // 完成實作
        var canvas = document.getElementById("canvas");
        var bbx = canvas.getBoundingClientRect(); // 避免失真
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height) // 重置畫布
            ctx.font = "20px sans-serif"
            ctx.textAlign="center"
            ctx.fillText(prize.title,150,60)
            ctx.fillText(prize.content,150,100)
            canvas.style="background-image:url('"+canvas.toDataURL("image/png")+"')";
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle='rgb(206, 206, 206)';
            ctx.fillRect(0,0,canvas.width,canvas.height)
        }
        if(navigator.userAgent.includes("Mobile")){
            vm.showAutoBtn=true;
        }
        else{
            canvas.onmousedown=function(){
                if(vm.remain<=0)
                    alert("剩餘次數不足！")
                else{
                    if(vm.FirstTimeFlag==0) vm.scratch(); // 執行紀錄
                    vm.FirstTimeFlag=1;
                    canvas.onmousemove=function(e){
                        var w = 15;			// 清除區域的寬度
                        var h = 15;			// 清除區域的高度
                        var x = (e.clientX-bbx.left)*(canvas.width/bbx.width);    // 清除區域的x位置
                        var y = (e.clientY-bbx.top)*(canvas.height/bbx.height);		// 清除區域的y位置
                        ctx.clearRect(x,y,w,h);
                    }
                    canvas.onmouseup=function(){
                        canvas.onmousemove=null;
                    }
                }
            }
        }
        vm.changeEnabled=true; // 開啟刷新功能
        vm.autoEnabled=true; // 開啟自動刮開功能
    }
    vm.getStatus();
    vm.getPrize();
    vm.getHistory();
    vm.getCommodity();
}

