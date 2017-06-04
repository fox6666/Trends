/**
 * Created by Owen on 2017/5/13.
 */
var MongoClient = require("mongodb").MongoClient;
var settings = require("../settings.js");

//连接数据库
function _connectDB(callback){
    var url = settings.url;
    MongoClient.connect(url,function(err,db){
        if(err){
            throw err;
            console.log("连接数据库失败");
            return;
        }
        callback(err,db);
        // console.log("成功");
    })
}

//插入数据
exports.insertOne = function(collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).insertOne(json,function(err,result){
            if(err){
                callback(err,result);
                db.close();
                return;
            }
            callback(err,result);
            db.close();
        })
    })
}

//查找数据
//exports.find = function(collectionName,json,callback){
//    if(arguments.length != 3){
//        var callback = json;
//        callback("find函数的参数必须是三个",null);
//        db.close();
//        return;
//    }
//    _connectDB(function(err,db){
          //定义一个数组接收查找到的数据
//        var data = [];
//        var cursor = db.collection(collectionName).find(json);
//        cursor.each(function(err,doc){
//            if(err){
//                throw err;
//                db.close();
//                return;
//            }
//            if(doc != null){
//                console.log(doc);
//                data.push(doc);
//            }else{
//                callback(err,data);
//                db.close();
//            }
//        })
//    })
//}

//查找数据  分页
exports.find = function(collectionName,json,A,B){
    if(arguments.length == 3){
        var callback = A;
        var limitNumber = 0;
        var skipNumber = 0;
    }else if(arguments.length == 4){
        var arge = A;
        var callback = B;
        var limitNumber = arge.pageCount || 0;
        var skipNumber = arge.pageCount * (arge.page - 1) || 0;
        var sort = arge.sort || {};
    };
    _connectDB(function(err,db){
        if(err){
            throw err;
            return;
        }
        var data = [];
        //处理不需要分页的时候

        // console.log(limitNumber,skipNumber);
        // console.log(sort);

        var cursor = db.collection(collectionName).find(json).limit(limitNumber).skip(skipNumber).sort(sort);

        cursor.each(function(err,doc){
            if(err){
                throw err;
                db.close();
                return;
            }
            if(doc != null){
                //console.log(doc);
                data.push(doc);
            }else{
                callback(err,data);
                db.close();
            }
        })
    })
}

//更新数据
exports.updateMany = function(collectionName,searchJson,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).updateMany(searchJson,json,function(err,result){
            if(err){
                callback(err,result);
                db.close();
                return;
            }
            callback(err,result);
            db.close();
        })
    })
}

//删除数据
exports.deleteMany = function(collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).deleteMany(json,function(err,result){
            if(err){
                throw err;
                db.close();
                return;
            }
            callback(err,result);
            db.close();
        })
    })
}

//获取数据的总数
exports.getAllCount = function(collectionName,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            db.close();
        });
    })
}
