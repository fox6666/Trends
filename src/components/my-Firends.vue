<template>
    <div class="my-firends">
        <div class="add-firends">
            <input type="text" class="add-firends-input" v-model="firendsName" @click="addFirendsInput"/>
            <button class="add-firends-btn" @click="addFirendsBtn">添加好友</button>
            <p class="warning" v-show="flag">{{message}}</p>
        </div>

        <br/>
        <hr/>
        <h1>我的好友</h1>
        <hr/>
        <br/>

        <ul class="my-firends-list">
            <li class="my-firends-item" v-for="(item,index) in firends">
                <a class="my-firends-item-a" href="javascript:;">{{item}}</a>
            </li>
        </ul>
    </div>
</template>


<script>
    export default{
        data(){
            return{
                firendsName: '',
                username: "",
                message: "",
                flag: false,
                firends: [],
            }
        },
        created(){
            var _this = this;
            if(localStorage.getItem("obj")){
                // 获取当前用户的头像
                _this.username = JSON.parse(localStorage.getItem("obj")).username;

                _this.getAddFirends(_this.username);
            }
        },
        methods: {
            addFirendsInput(){
                this.flag = false;
            },
            addFirendsBtn(){
                var _this = this;
                this.$http.get("http://localhost:3000/add-firends?firendsName=" + _this.firendsName + "&username=" + _this.username).then((success) => {
                    console.log(success.data.result);
                    if(success.data.result.message == 1){
                        _this.getAddFirends(_this.username);
                        return;
                    }
                    _this.message = success.data.result.data;
                    _this.flag = true;
                },(error) => {
                    console.log(error);
                })
            },
            getAddFirends(username){
                var _this = this;
                this.$http.get("http://localhost:3000/my-firends?username=" + username).then((success) => {
                    console.log(success.data.result);
                    _this.firends = success.data.result.result[0].firends;
                },(error) => {
                    console.log(error);
                })
            }
        },
    }
</script>