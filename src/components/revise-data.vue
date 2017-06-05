<template>
    <div class="revise-data-wrap">
        <h1  class="revise-data-title">修改个人资料</h1>
        <hr/>
        <div class="revise-data-coutent">
            <form action="http://localhost:3000/revise-data" enctype="multipart/form-data" method="POST">
                <div class="revise-data-coutent-pic-wrap" ref="cut" @mousedown="myMouseDown" @mousemove="myMousemove">
                    <img class="revise-data-coutent-pic" :src="src" alt="" draggable="false"/><!-- draggable="false" 设置图片不能编辑-->
                </div>
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

                flag: false,
                div: null,
                box: null,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            }
        },
        created(){
            if(localStorage.getItem("obj")){
                this.username = JSON.parse(localStorage.getItem("obj")).username;
            }

            var _this = this;
            this.$nextTick(function(){
                _this.box = this.$refs.cut;
                _this.div = document.createElement("div");

                console.log(_this.box.offsetTop,_this.box.offsetLeft);
            })
        },
        methods:{
            myMousemove(){
                var _this = this;
                _this.box.onmousedown = function(e){
                    _this.flag = true;
                    var startX = e.clientX;

                    _this.div.style.width = 0 + "px";
                    _this.div.style.height = 0 + "px";

                    _this.div.style.left = e.clientX + "px";
                    _this.div.style.top = e.clientY + "px";

                    _this.box.onmousemove = function(e){
                        if(_this.flag){
                            var endX = e.clientX;

                            var x = endX - startX;

                            if(x > 0){
                                _this.div.style.width = x + "px";
                                _this.div.style.height = x + "px";
                            }else{
                                _this.div.style.width = -x + "px";
                                _this.div.style.height = -x + "px";

                                _this.div.style.left = startX + x + "px";
                            }

                        }
                    }

                    document.onmouseup = function(e){
                        _this.flag = false;
                        _this.left = _this.div.offsetLeft - _this.box.offsetLeft;
                        _this.top = _this.div.offsetTop - _this.box.offsetTop;
                        _this.width = parseInt(_this.div.style.width);
                        _this.height = parseInt(_this.div.style.height);

                        console.log(_this.left,_this.top,_this.width,_this.height);
                    }
                }
            },
            myMouseDown(){
                var _this = this;
                // _this.div.style.background = "blue";
                _this.div.style.border = "1px dashed blue";
                _this.div.style.position = "absolute";
                _this.box.appendChild(_this.div);
                
            },
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
                        // console.log(file,38);
                        // console.log(this.result);
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


<style scoped>
    form{overflow: hidden;}
    .revise-data-coutent-pic-wrap{display: inline-block;}
</style>