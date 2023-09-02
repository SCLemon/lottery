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
            buyHistory:[],
            FirstTimeFlag:0,
            remainPlay:1,
            changeEnabled:false,
            autoEnabled:false,
            openID:0,
            prob:0,
            fadded:0,
            added:0,
            mainControl:false,
            key:'',
            showAddListBtn:false,
            stageRemain:[],
            isDouble:false,
            goals:[],
            bellStatus:0,
            alertMsgBlock:false,
            alertOption:'',
            alertMsg:'',
            alertTimer:0,
            ticketItem:'img/stage6.png',
            ticketNum:1,
            ticketBlock:false,
        },
        methods:{
            getPermission(){ // 完成實作
                var url='https://script.google.com/macros/s/AKfycbxZm-OQYqwepnYdHDNRTweh_xWw2TE_DFhX1waipHmANvwsdwH9lR_je-btc6GARyt0oQ/exec';
                var formData=new FormData();
                if(localStorage.getItem('Permission')==null) var vr = prompt('首次驗證：');
                else var vr= localStorage.getItem('Permission');
                formData.append("verify",vr);
                var config={
                    method:"post",
                    body:formData,
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    if(resp.status=='success') {
                        localStorage.setItem('Permission',resp.key)
                        this.mainControl=true;
                        this.key=resp.key;
                    }
                    else{
                        this.alert('No Permission','error');
                        this.mainControl=false;
                        this.key=resp.key;
                    }
                })
            },
            getPrize(option){ // 完成實作
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
                    draw(this.prize,option);
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
                    this.prob=(resp.prob*100).toFixed(5);
                    this.added=resp.added;
                    this.fadded=resp.fadded;
                    this.showAddListBtn=resp.mission.length<5;
                })
            },
            submit(id){ // 完成實作
                var btn = document.getElementsByClassName("btn")[id-1];
                if(confirm("確認發送？") && this.mainControl){
                    this.alert('發送請求中，請稍候','warn');
                    btn.innerText="發送中";
                    const url = 'https://script.google.com/macros/s/AKfycbwyHnA3Pk9W9iw_4Nt9fDTnmuRtKhqPqCBAOA-VsRT4fE3nvpMMO18-fICvLPEhC7-pOg/exec';
                    var formData=new FormData();
                    formData.append("id",id);
                    formData.append('key',this.key)
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=="success"){
                            this.alert("發送成功",'check')
                            btn.innerText="已完成";
                            this.getStatus();
                            this.getGoal();
                            this.ticket(6,1);
                        }
                        else{
                            this.alert("發送失敗",'error')
                            btn.innerText="重新嘗試";
                        }
                    })
                }
            },
            scratch(){  // 完成實作
                this.alert('獎品紀錄中 (請勿刷新)','warn');
                const url='https://script.google.com/macros/s/AKfycbyQpaMQ7qdN7ZvyxvKaIJs9CeHZcxYmUlQ2iPOyJCO0IH0NwAD524gPWovEw3ncxGgX/exec';
                var formData=new FormData();
                formData.append("id",this.prize.id);
                formData.append("title",this.prize.title);
                formData.append("content",this.prize.content)
                formData.append('key',this.key);
                formData.append('isDouble',this.isDouble);
                var config={
                    method:"post",
                    body:formData,
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.text())
                .then(resp=>{
                    this.isDouble=false;
                    this.getHistory();
                    this.alert('獎品紀錄成功','check');
                })
            },
            changePrize(flag){ // 完成實作
                if(flag=='auto'?true:confirm("刷新刮刮卡？")){
                    this.alert('刷新中，請稍後','warn');
                    this.changeEnabled=false;
                    this.FirstTimeFlag=0;
                    var refresh = document.getElementById("refresh");
                    refresh.classList.add("fa-spin");
                    this.getPrize('change');
                    this.getStatus();
                    this.getStage();
                }
            },
            autoScratch(){ // 完成實作
                if(vm.remain<=0)
                    this.alert("剩餘次數不足！",'error');
                else if(confirm("確認刮開？") && this.mainControl){
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
            getBuyHistory(){ // 完成實作
                const url='https://script.google.com/macros/s/AKfycbxuVL3O3Zwj6WVDIF0QvqPh2jgWTH0nCuDftA81n6tv7ROmPa1Gu7XKM_dTuLaex1RLww/exec'
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.buyHistory = resp;
                })
            }
            ,
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
                if(confirm('確認兌換？') && this.mainControl){
                    this.alert('兌換中，請稍後','warn');
                    sd.innerText='傳送中～'
                    const url='https://script.google.com/macros/s/AKfycbwE-a9k3Iwal4V5sVqyv4FIbW678kUeA5HsV4_A2NXg-ZckjDnylk44FjX7apCiNGP7/exec';
                    var formData=new FormData();
                    formData.append("content",content);
                    formData.append("price",price);
                    formData.append('key',this.key);
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=='failed') {
                            this.alert('兌換失敗','error');
                            sd.innerText='兌換失敗'
                        }
                        else{
                            sd.innerText='兌換成功'
                            this.alert("兌換成功",'check')
                            this.point=resp;
                            this.getStatus();
                        }
                    })
                }
            },
            getGoal(){
                const url='https://script.google.com/macros/s/AKfycbzt2haMyqasS8Fe2bRE2m44g7ZliIygojZhX7pt7R71sTqEJjssAsuUjiJ5K-0pZLbObw/exec'
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.goals=resp;
                })
            },
            goalSend(index){
                this.alert('ˊ成就校驗中，請稍候！','warn');
                const url = 'https://script.google.com/macros/s/AKfycbzt2haMyqasS8Fe2bRE2m44g7ZliIygojZhX7pt7R71sTqEJjssAsuUjiJ5K-0pZLbObw/exec'
                var formData=new FormData();
                formData.append("id",index);
                formData.append('key',this.key);
                var config={
                    method:"post",
                    body:formData,
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    if(resp.status=='failed') {
                        this.alert('兌換失敗','error');
                    }
                    else{
                        this.alert("恭喜獲得："+resp.name,'check');
                        this.getStatus();
                        this.getStage();
                        this.ticket(resp.id,1);
                    }
                    this.getGoal();
                })
            },
            openList(){ // 完成實作
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
            alert(msg,option){
                clearTimeout(this.alertTimer)
                this.alertMsgBlock=true;
                this.alertMsg=msg;
                if(option=='check') this.alertOption='check';
                else if(option=='warn') this.alertOption='warn';
                else if(option=='error') this.alertOption='error';
                this.alertTimer = setTimeout(() => {
                    this.alertMsgBlock=false;
                }, 2500);
            },
            addList(){ // 完成實作
                var content = prompt('新增每日任務:');
                if(content!='' && content!=undefined && content.trim()!=''){
                    this.alert('新增中，請稍後','warn');
                    const url='https://script.google.com/macros/s/AKfycbwCm1TtFOcOF3Qi8MuPEd5160ea38IV-gXgqiCeecde6vljHJeX_ceTxjSaTOxkoasQlA/exec';
                    var formData=new FormData();
                    formData.append("content",content);
                    formData.append('key',this.key);
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=='failed') {
                            this.alert('新增失敗','error');
                        }
                        else{
                            this.alert("新增成功",'check');
                            this.mission.push({
                                id:'5',
                                name:'任務五',
                                content:content,
                                checked:false
                            })
                            this.showAddListBtn=false;
                            this.getStatus();
                        }
                    })
                }
            },
            getStage(){ // 完成實作
                const url='https://script.google.com/macros/s/AKfycbwDnDoZRI9cq4Ewg0AFBhtcYlnJdSjQ_Sq_ZQqGqqVqioFTIT-hXrSxp34Fu5hrq-qP/exec'
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.stageRemain = resp;
                })
            },
            useStage(id){
                if(this.stageRemain['stage'+id]>0?confirm('確認使用道具？'):this.alert('道具不足','error')){
                    this.alert('道具校驗中，請稍候！','warn');
                    const url='https://script.google.com/macros/s/AKfycbwDnDoZRI9cq4Ewg0AFBhtcYlnJdSjQ_Sq_ZQqGqqVqioFTIT-hXrSxp34Fu5hrq-qP/exec'
                    var formData=new FormData();
                    formData.append('key',this.key);
                    formData.append('id',id);
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=='success'){
                            this.getStage();
                            this.use(id);
                        }
                        else this.alert('道具不足，使用失敗','error');
                    })
                }
            },
            use(id){
                if(id==1){ // 機率上升
                    this.alert('機率提升（請勿刷新刮刮卡）','check');
                    const url='https://script.google.com/macros/s/AKfycbwL7u3ivlEgsBPEyUc4lTh9FbE9ute7H6kqQU17jAL1tCtURM2t1VHR1jEkz7ithaPO/exec'
                    var config={
                        method:"get",
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        this.changePrize('auto');
                    })
                }
                else if(id==2){ // 透視卡牌
                    this.alert('透視卡牌（延遲刷新）','check');
                    var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    setTimeout(() => {
                        if(confirm('是否獲取本次獎勵？')) {
                            this.scratch();
                            this.changePrize('auto');
                        }
                        else this.changePrize('auto');
                    }, 3000);
                }
                else if(id==3){ // 雙倍獎勵
                    this.isDouble=true;
                    this.alert('雙倍獎勵（可刷新卡牌）','check');
                }
                else if(id==4){ // 再抽一次
                    const url='https://script.google.com/macros/s/AKfycbwmsRULSHcethoqlnfgbc5zz_gXY7fJ3Rs8AbepwTCfCTiysuHUf3opL6XsYYIA53NX/exec';
                    var formData=new FormData();
                    formData.append('key',this.key);
                    var config={
                        method:"post",
                        body:formData,
                        redirect:"follow"
                    }
                    fetch(url,config)
                    .then(resp=>resp.text())
                    .then(resp=>{
                        if(resp=='success'){
                            this.alert('獲得機會一次','check');
                            this.getStatus();
                            this.changePrize('auto');
                        }
                        else this.alert('使用失敗','error');
                    })
                }
                else if(id==5){ // 抽取建議
                    if(this.prize.id<5) this.alert('(五等獎以下）不建議抽取此張','warn');
                    else this.alert('(六等獎以上）建議抽取此張','warn'); 
                }
            },
            toggleBell(msg){
                this.alert(msg+'中，請稍後','warn');
                var url='https://script.google.com/macros/s/AKfycbyQohwBtf8iCqObdCf4sZEoYDmy5t4v2jUwXNWhmNzeKlbOC6KKZMmuES6UYJzFF3W4/exec'
                var formData=new FormData();
                formData.append('key',this.key);
                var config={
                    method:"post",
                    body:formData,
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.text())
                .then(resp=>{
                    if(resp=='success'){
                        this.bellStatus=(this.bellStatus==false?true:false);
                        this.alert(msg+'通知成功','check')
                    }
                    else this.alert(msg+'通知失敗','error');
                })        
            },
            getBell(){
                var url='https://script.google.com/macros/s/AKfycbyQohwBtf8iCqObdCf4sZEoYDmy5t4v2jUwXNWhmNzeKlbOC6KKZMmuES6UYJzFF3W4/exec';
                var config={
                    method:"get",
                    redirect:"follow"
                }
                fetch(url,config)
                .then(resp=>resp.json())
                .then(resp=>{
                    this.bellStatus=resp.status;
                })
            },
            ticket(id,num){
                this.ticketBlock=true;
                this.ticketItem='img/stage'+id+'.png';
                this.ticketNum=num;
            },
            closeTK(){
                this.ticketBlock=false;
            }
        }
    })
    function draw(prize,option){ // 完成實作
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
        // 電腦
        if(navigator.userAgent.includes('Mobile')){

        }
        else{
            canvas.onmousedown=function(){
                if(vm.remain<=0)
                    this.alert("剩餘次數不足！",'error');
                else{
                    if(vm.FirstTimeFlag==0 && vm.mainControl) vm.scratch(); // 執行紀錄
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
        // 手機或平板
        // canvas.ontouchstart=function(){
        //     if(vm.remain<=0)
        //         alert("剩餘次數不足！")
        //     else{
        //         if(vm.FirstTimeFlag==0 && vm.mainControl) vm.scratch(); // 執行紀錄
        //         vm.FirstTimeFlag=1;
        //         canvas.ontouchmove=function(e){
        //             var w = 15;			// 清除區域的寬度
        //             var h = 15;			// 清除區域的高度
        //             var x = (e.clientX-bbx.left)*(canvas.width/bbx.width);    // 清除區域的x位置
        //             var y = (e.clientY-bbx.top)*(canvas.height/bbx.height);		// 清除區域的y位置
        //             ctx.clearRect(x,y,w,h);
        //         }
        //         canvas.ontouchend=function(){
        //             canvas.ontouchmove=null;
        //         }
        //     }
        // }
        vm.changeEnabled=true; // 開啟刷新功能
        vm.autoEnabled=true; // 開啟自動刮開功能
        if(option=='change') vm.alert('刷新成功','check');
    }
    vm.getPermission();
    vm.getStatus();
    vm.getPrize();
    vm.getHistory();
    vm.getCommodity();
    vm.getBuyHistory();
    vm.getStage();
    vm.getGoal();
    vm.getBell();
}

