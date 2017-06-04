/**
 * Created by Owen on 2017/6/1.
 */
var formidable = require("formidable");
var db = require("../model/db");
var crypto = require("crypto");
var fs = require("fs");
var url = require("url");
var ObjectID = require('mongodb').ObjectID;



exports.showIndex = function(req,res){
    // console.log(req.session.status);
    res.send("node");
}

exports.register = function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var password = md5(fields.password + "Owen");
        db.find("user_table",{"username": fields.username},function(err,result){
            if(err){
              return;
            }
            if(result.length > 0){
                res.send({"message": 0});//用户名已存在
            }else{
                db.insertOne("user_table",{
                  "username": fields.username,
                  "password": password,
                  "headPicture": ""
                },function(err,result){
                  if(err){
                    res.json({"message": -1});//失败
                    return;
                  }
                  res.json({"message": 1});//成功
                })
            }
        })
    })
}

exports.login = function(req,res){
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    var password = md5(fields.password + "Owen");
    db.find("user_table",{"username": fields.username},function(err,result){
      if(err){
          return;
      }
      if(result.length <= 0){
          res.send({"message": 0});//用户名不存在
      }else{
          if(result[0].password == password){
              req.session.status = 1;
              req.session.username = fields.username;
              // console.log(req.session,61);
              res.send({"message": 1});//成功
          }else{
              res.send({"message": -1});//密码错误
          }
      }
    })
  })
}

exports.reviseData = function(req,res){
    var form = new formidable.IncomingForm();
    // console.log(req.session,72);
    form.uploadDir = "./static/img";
    form.parse(req, function (err, fields, files) {
        // console.log(fields,76);
        var oldUrl = files['head-picture'].path; 
        var newUrl = "./static/img/" + fields.username + ".jpg";
        fs.rename(oldUrl,newUrl,function(err){
           if(err){
              console.log(err)
              return;
           }
           db.updateMany("user_table",{"username":fields.username},{$set:{"headPicture": fields.username + ".jpg"}},function(err,result){
              if(err){
                console.log(err);
                return;
              }
              // console.log(1);
              res.send({"message":1})
           })
           
        })
    });
}

exports.publish = function(req,res){
  var query = url.parse(req.url,true).query;
  var username = query.username;
  var textareaValue = query.textareaValue;
  var date = query.date;
  db.insertOne("trends_table",{
    "username": username,
    "textareaValue": textareaValue,
    "date": date,
    "assist": {
      "assistNumber": 0,
      "assistName": []
    }
  },function(err,result){
    if(err){
      res.send({"message": -1});
      return;
    }
    res.send({"message": 1});
  })

}

exports.allTrends = function(req,res){
  const pageNumber = parseInt(req.query.pageCount);
  const page = parseInt(req.query.page);

  db.getAllCount("trends_table",function(result){
    // console.log(result,122);
    var pageCount = result;
    getAllTrends(pageCount);
  })

  function getAllTrends(pageCount){
      db.find("trends_table",{},{ pageCount:pageNumber,page:page,"sort": {date : -1}},function(err,result){
            if(err){
              res.send({"message": -1,"data": []});
              return;
            }
            if(result.length == 0){
              res.send({"message": 0,"data": []});
            }else{
              // console.log(result,134);
              const resultData = {
                pageCount: pageCount,
                result: result
              }
              res.send({"message": 1,"data": resultData});
            }
      })
  }
  
}

exports.myTrends = function(req,res){
  var query = url.parse(req.url,true).query;
  var username = query.username;//,{"sort": {$sort: { date : 1 }}}
  db.find("trends_table",{"username": username},{ "sort": {date : -1}},function(err,result){
    if(err){
      res.send({"message": -1})
      return;
    }
    if(result.length == 0){
      res.send({"message": 0});
    }else{
      res.send({"message": 1,"data": result});
    }
  })
}

exports.assist = function(req,res){
  const query = url.parse(req.url,true).query;
  const _id = query._id;
  const assistNumber = query.assistNumber;
  const username = query.username;
  const type = query.type;

  if(type == 0){
      db.find("trends_table",{"_id": ObjectID(_id)},function(err,result){
        if(result.length > 0){

            let assistName = [];
            const number = result[0].assist.assistName.indexOf(username); 
            var a = result[0].assist.assistName.splice(number,1);//这里的返回值是被删的元素
            // console.log(a)
            assistName = result[0].assist.assistName;

            db.updateMany("trends_table",{"_id":ObjectID(_id)},{$set:{"assist.assistNumber":assistNumber,"assist.assistName": assistName}},function(err,result){

              if(err){
                res.send({"message": -1});
                return;
              }
              res.send({"message": 1});
            })
        }   
      })
  }else{
      db.find("trends_table",{"_id": ObjectID(_id)},function(err,result){
        if(result.length > 0){

            let assistName = [];
            result[0].assist.assistName.unshift(username); 
            assistName = result[0].assist.assistName;

            db.updateMany("trends_table",{"_id":ObjectID(_id)},{$set:{"assist.assistNumber":assistNumber,"assist.assistName": assistName}},function(err,result){

              if(err){
                res.send({"message": -1});
                return;
              }
              res.send({"message": 1});
            })
        }    
      })
  }
}

exports.headPicture = function(req,res){
  var query = url.parse(req.url,true).query;
  db.find('user_table',{"username": query.username},function(err,result){
    // delete result[0].password;
    res.send(result);
  })
}

exports.myFirends = function(req,res){
  var username = req.query.username;
  console.log(username,225)
  db.find("firends_table",{"username": username},function(err,result){
    if(result.length == 0){
      res.json({
        "result": {
          "message": -1,
          "result": []
        }
      })
    }else{
      res.json({
        "result": {
          "message": 1,
          "result": result
        }
      })
    }
  })
}

exports.addFirends = function(req,res){
  var username = req.query.username;
  var firendsName = req.query.firendsName;
  if(username == firendsName){
    res.json({
      "result": {
        "message": 2,
        "data": "不能添加自己为好友哦！",
      }
    })
  }else{
    db.find('user_table',{"username": firendsName},function(err,result){
      if(result.length == 0){
        res.json({
          "result": {
            "message": -1,
            "data": "没有找到这个用户",
          }
        })
      }else{
        let firends = [];
        db.find("firends_table",{"username": username},function(err,result){
          if(result.length == 0){
            firends.unshift(firendsName);
            db.insertOne("firends_table",{
              "username": username,
              "firends": firends,
            },function(err,result){
              res.json({
                "result": {
                  "message": 1,
                }
              })
            })
          }else{
            firends = result[0].firends;
            if(firends.indexOf(firendsName) == -1){
              firends.unshift(firendsName);
              db.updateMany("firends_table",{"username": username},{$set:{"firends": firends}},function(err,result){
                  res.json({
                    "result": {
                      "message": 1,
                    }
                  })
              })
            }else{
              res.json({
                "result": {
                  "message": 0,
                  "data": "该用户，已经是您的好友了！",
                }
              })
            }
          }
        })
        


          
      }
    })
  }
    
}


function md5(str){
  var md5sum = crypto.createHash('md5');
  return md5sum.update(str.toString()).digest("hex");
}
