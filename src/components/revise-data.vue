<template>
    <div class="revise-data-wrap">
        <h1  class="revise-data-title">修改个人资料</h1>
        <hr/>
        <div class="revise-data-coutent">
            <form action="http://localhost:3000/revise-data" enctype="multipart/form-data" method="POST">
                <img class="revise-data-coutent-pic" :src="src" alt="" />
                <input type="text" name="username" id="username" v-model="username"style="height:0px;"/>
                <input type="file" size="20" autocomplete="off" id="head-picture"  @change="showFile($event)" name="head-picture"><!--  -->
                <input type="submit" @click="mySubmit"/>
            </form>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                src: "",
                username: '',
            }
        },
        created(){
            if(localStorage.getItem("obj")){
                this.username = JSON.parse(localStorage.getItem("obj")).username;
            }
        },
        methods:{
            showFile(event){
                var _this = this;
                var MyTest = event.target.files[0];
                if(window.FileReader) {  
                    // add your code here  
                    var reader = new FileReader();
                    reader.readAsDataURL(MyTest);
                    reader.onload = function(theFile) {
                        var image = new Image();
                        image.src = theFile.target.result;
                        _this.src = image.src;
                        image.onload = function() {
                            console.log("图片的宽度为"+this.width+",长度为"+this.height);
                        };
                    };

                    var reader = new FileReader();
                    reader.readAsBinaryString(MyTest);
                    reader.onload = function(file){
                        console.log(file,38);
                        console.log(this.result);
                        let url = this.result;

                        // var total2str = "";
                        // for (var i = 0; i < url.length; i++) {
                        //       var num10 = url.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
                        //       var str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

                        //       if( total2str == "" ){
                        //         total2str = str2;
                        //       }else{
                        //         total2str = total2str + " " + str2;
                        //       }
                        // }
                        // console.log("编码后:" + total2str);

                        // url = total2str;
                        
                        // _this.$http.post("http://localhost:3000/revise-data",{
                        //     "url": url
                        // },{}).then(function(success){

                        // },function(error){

                        // })
                    }
                }  
                else {  
                    alert("Not supported by your browser!");  
                } 
                    
            },
            mySubmit(){
                
            }
        },
    }
</script>