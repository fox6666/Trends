<template>
    <div class="login-wrap">
        <h1 class="login-title">登入界面</h1>
        <hr/>
        <form>
            <label class="login-label" for="username">用户名：</label><input class="login-input" type="text" palcehoder="请输入用户名..." id="username" v-model="username" @input="updata($event,'username')" @click="inputClick"/>
            <br/>
            <label class="login-label" for="password">密码：</label><input class="login-input" type="password" palcehoder="请输入密码..." id="password" v-model="password" @input="updata($event,'password')" @click="inputClick"/>
            <br/>
            <input class="login-btn c-f" type="button" value="登入" @click="login"/>
        </form>
        <p class="warning" v-show="flag">{{message}}</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                username: "",
                password: "",
                message: "",
                flag: false,
            }
        },
        created(){
            if(localStorage.getItem("obj")){
                this.username = JSON.parse(localStorage.getItem("obj")).username;
            }
        },
        methods: {
            updata(e,type){
                const value = e.target.value;
                if(type == "username"){
                    if(value.length > 6){
                        this.flag = true;
                        this.message = "用户名的长度不能大于6个字符！"
                    }else{
                        this.flag = false;
                    }
                }else if(type == "password"){
                    var reg = /^[0-9a-zA-Z]{6,}$/;
                    if(!reg.test(value)){
                        this.flag = true;
                        this.message = "密码必须是数字与字母组成,且长度不能小于6位！"
                    }else{
                        this.flag = false;
                    }
                }else if(type == "password2"){
                    if(value != this.password){
                        this.flag = true;
                        this.message = "两次输入的密码不一致！"
                    }else{
                        this.flag = false;
                    }
                }
            },
            login(){
                var _this = this;
                this.$http.post("http://localhost:3000/login",{
                    "username": _this.username,
                    "password": _this.password
                },{}).then(function(success){
                    console.log(success.data);
                    _this.flag = true;
                    if(success.data.message == 1){
                        _this.message = "成功！";
                        const obj = {
                            "username": _this.username,
                            "status": 1,//表示已注册，已登入
                            "headPicture": ""
                        }
                        localStorage.setItem("obj",JSON.stringify(obj));
                        setTimeout(function(){
                            const url = "/";
                            _this.$router.push({"path":url});
                        },1000)
                    }else if(success.data.message == 0){
                        _this.message = "用户名不存在！";
                    }else if(success.data.message == -1){
                        _this.message = "密码错误！";
                    }
                },function(error){
                    console.log(error);
                })
            },
            //隐藏提示窗
            inputClick(){       
                this.flag = false;
            }
        }
    }
</script>
