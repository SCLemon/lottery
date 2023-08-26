window.onload=function(){
    const vm = new Vue({
        el:"#app",
        data:{
            mission:[],
            remain:0,
            point:0,
            prize:{},
            FirstTimeFlag:0,
            remainPlay:1
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
                    this.point=resp.point
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
                    // do nothing
                })
            },
            changePrize(){ // 完成實作
                if(confirm("刷新刮刮卡？")){
                    vm.FirstTimeFlag=0;
                    var refresh = document.getElementById("refresh");
                    refresh.classList.add("fa-spin");
                    this.getPrize();
                    this.getStatus();
                }
            }
        }
    })
    function draw(prize){
        var canvas = document.getElementById("canvas");
        var bbx = canvas.getBoundingClientRect(); // 避免失真
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.font = "20px sans-serif"
            ctx.textAlign="center"
            ctx.fillText(prize.title,150,60)
            ctx.fillText(prize.content,150,100)
            canvas.style="background-image:url('"+canvas.toDataURL("image/png")+"')";
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle='rgb(206, 206, 206)';
            ctx.fillRect(0,0,canvas.width,canvas.height)
        }
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
                    console.log(x,y)
                    ctx.clearRect(x,y,w,h);
                }
                canvas.onmouseup=function(){
                    canvas.onmousemove=null;
                }
            }
        }
        if(navigator.userAgent.includes("mobile")){
            console.log("mobile")
            canvas.ontouchstart=function(){
                if(vm.remain<=0)
                    alert("剩餘次數不足！")
                else{
                    if(vm.FirstTimeFlag==0) vm.scratch(); // 執行紀錄
                    vm.FirstTimeFlag=1;
                    canvas.ontouchmove=function(e){
                        var w = 15;			// 清除區域的寬度
                        var h = 15;			// 清除區域的高度
                        var x = (e.clientX-bbx.left)*(canvas.width/bbx.width);    // 清除區域的x位置
                        var y = (e.clientY-bbx.top)*(canvas.height/bbx.height);		// 清除區域的y位置
                        console.log(x,y)
                        ctx.clearRect(x,y,w,h);
                    }
                    canvas.ontouchend=function(){
                        canvas.ontouchmove=null;
                    }
                }
            }
        }
    }
    vm.getStatus();
    vm.getPrize();
}




