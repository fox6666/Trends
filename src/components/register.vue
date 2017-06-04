<template>
    <div class="register-wrap">
        <h1 class="register-title">注册界面</h1>
        <hr/>
        <form>
            <label class="register-label" for="username">用户名：</label><input class="register-input" type="text" palcehoder="请输入用户名..." id="username" v-model="username" @click="inputClick" @input="updata($event,'username')"/>
            <br/>
            <label class="register-label" for="password">密码：</label><input class="register-input" type="password" palcehoder="请输入密码..." id="password" v-model="password" @click="inputClick" @input="updata($event,'password')"/>
            <br/>
            <label class="register-label" for="password2">重输密码：</label><input class="register-input" type="password" palcehoder="请输入密码..." id="password2"  @click="inputClick" @input="updata($event,'password2')"/>
            <br/>
            <input class="register-btn c-f" type="button" value="注册" @click="register"/>
        </form>
        <p class="warning" v-show="flag">{{message}}</p>

        <div class="popup bc-0-4" v-show="status == 1 ? true : false">
            <h1>3秒后跳到登入页面！</h1>
        </div>
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
                status: 0,
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
            register(){
                var _this = this;
                this.$http.post("http://localhost:3000/register",{
                    "username": _this.username,
                    "password": _this.password
                },{}).then(function(success){
                    console.log(success.data);
                    _this.flag = true;
                    if(success.data.message == 1){
                        _this.status =1;
                        _this.message = "成功！";
                        const obj = {
                            "username": _this.username,
                            "status": 0,//表示已注册，未登入
                            "headPicture": ""
                        }
                        localStorage.setItem("obj",JSON.stringify(obj));
                        setTimeout(function(){
                            const url = "/login";
                            _this.$router.push({"path":url});
                        },3000)
                    }else if(success.data.message == 0){
                        _this.message = "用户名已存在！";
                    }else if(success.data.message == -1){
                        _this.message = "失败！";
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
