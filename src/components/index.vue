<template>
    <div class="index-wrap">
        <div class="index-title bc-0-6 clear">
            <a class="index-title-a fl c-f" href="javascript:;" @click="allTrends">全部动态</a>
            <a class="index-title-a fl c-f" href="javascript:;" @click="myTrends">我的动态</a>
             <a class="fl c-f" href="javascript:;" @click="myFirends">好友列表</a><!-- -->
            <div class="fr clear">
                <div v-if="username != '' ? false : true">
                    <a class="index-title-a fl c-f" href="javascript:;" @click="register">注册</a>
                    <a class="fl c-f" href="javascript:;" @click="login">登入</a>
                </div>
                
                <div v-if="username != '' ? true : false" class="on-line">
                    <img class="head-picture" :src="srcUrl == '' ? '../../static/img/0.jpg' : '../../static/img/' + srcUrl"  height="20" width="20" alt=""/>
                    <a class="c-f" href="javascript:;">{{username}}在线</a>
                    <ul class="on-line-list">
                        <li class="on-line-item bc-0-3"><a class="c-255-8" href="javascript:;" @click="reviseData(username)">修改个人资料</a></li>
                        <li class="on-line-item bc-0-3"><a class="c-255-8" href="javascript:;" @click="logOut">退出登入</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="publish">
            <textarea class="publish-textarea" v-model="textareaValue"></textarea>
            <br/>
            <button class="publish-btn" @click="publish">发表说说</button>
        </div>

        <div class="index-content">
            <div class="clear">
                <div class="index-content-list fl" v-for="(item,index) in allTrendsList">
                    <div class="index-content-list-div h-pct100" style="background:pink;">
                        <div>
                            <p class="index-content-list-title">
                                <img class="head-picture" :src="item.headPicture == '' ? '../../static/img/0.jpg' : '../../static/img/' + item.headPicture"  height="20" width="20" alt=""/>
                                {{item.username}}
                            </p>
                            <div class="index-content-list-main">{{item.textareaValue}}</div>
                            <p class="index-content-list-date">{{item.date}}</p>
                            <p class="assist clear">赞<span class="assist-span">{{item.assist.assistNumber}}</span><span class="assist-span" :class="{'assist-pic': (item.assist.assistName.indexOf(username) != -1) ? true : false,'assist-no-pic': (item.assist.assistName.indexOf(username) == -1) ? true : false}" @click="assist(index)"></span><span class="comment fr">评论</span></p>
                            <p class="assistName"><a v-for="(val,index2) in item.assist.assistName" v-if="index > 10 ? false : true">{{val}}<span v-if="index2 == item.assist.assistName.length - 1 ? false : true">,</span></a>等{{item.assist.assistName.length}}人赞了</p>
                        </div>
                        <div class="comment-wrap">
                            <textarea class="comment-textarea" v-model="comment"></textarea>
                            <div class="clear publish-comment"><span class="fr" @click="publishComment(item._id)">发表评论</span></div>
                            <ul class="comment-list">
                                <li class="comment-item">
                                    <span class="comment-item-span">XXX:</span>
                                    <p class="comment-item-p">哈哈哈</p>
                                </li>
                            </ul>
                        </div>    
                    </div>
                </div>
            </div>

            <div class="btn-wrap">
                <button v-for="item in pageCount" class="btn" @click="pageBtn(item)" :class="{'btn-active': btnHtml == item ? true : false}">{{item}}</button>
                <button>每页{{pageNumber}}条</button>
                <button>一共{{pageCount}}页</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                message: "haha",
                username: "",
                srcUrl: "",
                textareaValue: "",
                allTrendsList: [],
                assistFlag: false,
                pageCount: 0,
                pageNumber: 6,
                btnHtml: 1,
                comment: "评论",
            }
        },
        created(){
            var _this = this;
            if(localStorage.getItem("obj")){
                // 获取当前用户的头像
                this.username = JSON.parse(localStorage.getItem("obj")).username;
                this.$http.get("http://localhost:3000/head-picture?username=" + _this.username,)
                .then((success)=>{
                    // console.log(success,72);
                    _this.srcUrl = success.body[0].headPicture;

                    localStorage.setItem("obj",JSON.stringify({
                        username: _this.username,
                        status: 1,
                        headPicture: _this.srcUrl
                    }))
                },(error)=>{console.log(error)});

                // 获取所有的说说列表
                this.getAllTrends(1);
            }
        },
        methods: {
            register(){
                const url = "/register";
                this.$router.push({"path":url});
            },
            allTrends(){

            },
            myTrends(){
                const url = "/my-trends";
                this.$router.push({"path":url});
            },
            myFirends(){
                const url = "/my-firends"
                this.$router.push({"path":url});
            },
            login(){
                const url = "/login";
                this.$router.push({"path":url});
            },
            logOut(){
                localStorage.removeItem("obj");
                this.username = "";
            },
            reviseData(username){
                const url = "/revise-data";
                this.$router.push({"path":url});
            },
            publish(){
                if(this.username == ""){
                    console.log("请登入！");
                }else{
                    var _this = this;
                    var url = "http://localhost:3000/publish?username=" + _this.username + "&textareaValue=" + _this.textareaValue + "&date=" + new Date();
                    this.$http.get(url).then(function(success){
                        // console.log(success);
                        _this.textareaValue = "";
                        _this.btnHtml = 1;

                        _this.getAllTrends(1);
                    },function(error){
                        console.log(error);
                    })
                }
            },
            assist(index){
                var _this = this;
                if(this.allTrendsList[index].assist.assistName.indexOf(this.username) == -1){
                    this.allTrendsList[index].assist.assistName.unshift(this.username);

                    let _id = this.allTrendsList[index]._id;
                    let assistNumber = parseInt(this.allTrendsList[index].assist.assistNumber);

                    assistNumber += 1;
                    this.allTrendsList[index].assist.assistNumber = assistNumber;

                    const url = "http://localhost:3000/assist?_id=" + _id + "&assistNumber=" + assistNumber + "&username=" + _this.username + "&type=1";

                    this.$http.put(url).then((success) => {
                        // console.log(success.body.message);
                        // _this.allTrendsList = success.body.data;
                    },(error) => {
                        console.log(error);
                    })
                }else{
                    const number = this.allTrendsList[index].assist.assistName.indexOf(this.username);
                    this.allTrendsList[index].assist.assistName.splice(number, 1);

                    let _id = this.allTrendsList[index]._id;
                    let assistNumber = parseInt(this.allTrendsList[index].assist.assistNumber);

                    assistNumber -= 1;
                    this.allTrendsList[index].assist.assistNumber = assistNumber;

                    const url = "http://localhost:3000/assist?_id=" + _id + "&assistNumber=" + assistNumber + "&username=" + _this.username + "&type=0";

                    this.$http.put(url).then((success) => {
                        // console.log(success.body.message);
                        // _this.allTrendsList = success.body.data;
                    },(error) => {
                        console.log(error);
                    })
                }     
            },
            pageBtn(number){
                console.log(number);
                this.btnHtml = number;
                this.getAllTrends(number);
            },
            getAllTrends(page){
                var _this = this;

                this.$http.get("http://localhost:3000/all-trends?pageCount="+ _this.pageNumber +"&page=" + page).then((success) => {
                    console.log(success.body.data);
                    if(success.body.data.length == 0){
                        return;
                    }
                    // _this.allTrendsList = success.body.data;
                    _this.pageCount = Math.ceil(success.body.data.pageCount/_this.pageNumber);

                    // 给每一条数据添加一个头像字段
                    _this.fn(0,success.body.data.result);
                },(error) => {
                    console.log(error);
                })
            },
            fn(number,result){
                var _this = this;

                if(number == result.length){
                    _this.allTrendsList = result;
                    // console.log(_this.allTrendsList,173)
                    return;
                }

                this.$http.get("http://localhost:3000/head-picture?username=" + result[number].username).then((success)=>{
                            console.log(success);
                            result[number].headPicture = success.data[0].headPicture ? success.data[0].headPicture : "";
                            _this.fn(++number,result);
                      },(error)=>{console.log(error)});
            },
            publishComment(id){
                let username = this.username;
                let comment = this.comment;
                let _id = id;
                this.$http.post("http://localhost:3000/publish-comment",{
                    "_id": _id,
                    "username": username,
                    "comment": comment
                }).then((success) => {
                    console.log(success);
                },(error) => {
                    console.log(error);
                })
            }
        }
    }
</script>