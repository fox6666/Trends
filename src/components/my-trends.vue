<template>
    <div class="my-trends">
        <div class="index-title bc-0-6 clear">
            <a class="index-title-a fl c-f" href="javascript:;" @click="allTrends">全部动态</a>
            <a class="index-title-a fl c-f" href="javascript:;" @click="myTrends">我的动态</a>
            <a class="fl c-f" href="javascript:;" @click="myFirends">好友列表</a>
            <div class="fr clear">
                <div v-if="username != '' ? false : true">
                    <a class="index-title-a fl c-f" href="javascript:;" @click="register">注册</a>
                    <a class="fl c-f" href="javascript:;" @click="login">登入</a>
                </div>
                
                <div v-if="username != '' ? true : false" class="on-line">
                    <img class="head-picture" :src="srcUrl == '' ? '../../static/img/0.jpg' : srcUrl"  height="20" width="20" alt=""/>
                    <a class="c-f" href="javascript:;">{{username}}在线</a>
                    <ul class="on-line-list">
                        <li class="on-line-item bc-0-3"><a class="c-255-8" href="javascript:;" @click="reviseData(username)">修改个人资料</a></li>
                        <li class="on-line-item bc-0-3"><a class="c-255-8" href="javascript:;" @click="logOut">退出登入</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="index-content">
            <div class="clear">
                <div class="index-content-list fl" v-for="(item,index) in myTrendsList">
                    <div class="index-content-list-div h-pct100" style="background:pink;">
                        <p class="index-content-list-title">{{item.username}}</p>
                        <div class="index-content-list-main">{{item.textareaValue}}</div>
                        <p class="index-content-list-date">{{item.date}}</p>
                        <p class="assist">赞<span class="assist-span">{{item.assist.assistNumber}}</span><span class="assist-span" :class="{'assist-pic': (item.assist.assistName.indexOf(username) != -1) ? true : false,'assist-no-pic': (item.assist.assistName.indexOf(username) == -1) ? true : false}" @click="assist(index)"></span></p>
                        <p class="assistName"><a v-for="(val,index2) in item.assist.assistName" v-if="index > 10 ? false : true">{{val}}<span v-if="index2 == item.assist.assistName.length - 1 ? false : true">,</span></a>等{{item.assist.assistName.length}}人赞了</p>
                    </div>
                </div>
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
                myTrendsList: [],
            }
        },
        created(){
            if(localStorage.getItem("obj")){
                this.username = JSON.parse(localStorage.getItem("obj")).username;
                this.getMyTrends(this.username);
            }
        },
        methods: {
            register(){
                const url = "/register";
                this.$router.push({"path":url});
            },
            allTrends(){
                const url = "/";
                this.$router.push({"path":url});
            },
            myTrends(){
                const url = "/my-trends";
                this.$router.push({"path":url});
            },
            login(){
                const url = "/login";
                this.$router.push({"path":url});
            },
            myFirends(){
                const url = "/my-firends"
                this.$router.push({"path":url});
            },
            logOut(){
                localStorage.removeItem("obj");
                this.username = "";
                this.myTrendsList = [];
            },
            reviseData(username){
                const url = "/revise-data";
                this.$router.push({"path":url});
            },
            getMyTrends(username){
                var _this = this;

                this.$http.get("http://localhost:3000/my-trends?username=" + _this.username).then((success) => {
                    console.log(success.body.data);
                    _this.myTrendsList = success.body.data;
                },(error) => {
                    console.log(error);
                })
            },
        },
            
    }
</script>