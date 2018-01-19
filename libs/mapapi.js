var utils = require('../utils/util.js');
class PMapWX {
  constructor(param) {
    this.ak = param["ak"];
    this.tableid = param["tableid"];
  }

  /**
 * 使用微信接口进行定位
 *
 * @param {string} type 坐标类型
 * @param {Function} success 成功执行
 * @param {Function} fail 失败执行
 * @param {Function} complete 完成后执行
 */
  getWXLocation(type, success, fail, complete) {
    type = type || 'gcj02',
    success = success || function () { };
    fail = fail || function () { };
    complete = complete || function () { };
    wx.getLocation({
      type: type,
      success: success,
      fail: fail,
      complete: complete
    });
  }
  getMapPoint(url, parameters, otherparam){
    url = url || '',
    parameters = parameters || '',    
    wx.request({
      url: url, 
      data: parameters,
      header: {
        'content-type': 'application/json' 
      },
      success: function (data) {
        
        let res = data["data"];
        if (res['status'] == 1) {
          let poiArr = res['datas'];
          let outputRes = {};
          outputRes["originalData"] = res;
          outputRes["wxMarkerData"] = [];
          outputRes["center"] = parameters['center'] ? parameters['center'] : otherparam['center'];
          var j=0;                 
          if (parameters['page'] && parameters['page'] != 1) j = (parameters['page']-1)*20;
          for (let i=0; i < poiArr.length; i++) {          
            let lng1 = outputRes['center'].split(',')[0];
            let lat1 = outputRes['center'].split(',')[1];
            let lng2 = poiArr[i]['_location'].split(',')[0];
            let lat2 = poiArr[i]['_location'].split(',')[1];
            let distance = poiArr[i]["_distance"] ? poiArr[i]["_distance"] : utils.getDistance(lng1, lat1, lng2, lat2); 
            if (poiArr[i]._image.length!=0){
              var url = poiArr[i]._image[0]._url; 
            }else{
              var url ='';
            }
            outputRes["wxMarkerData"][i] = {
              id: j,
              latitude: poiArr[i]['_location'].split(',')[1],
              longitude: poiArr[i]['_location'].split(',')[0],
              shopname: poiArr[i]["_name"],
              iconPath: otherparam["iconPath"],
              address: poiArr[i]["_address"],
              telephone: poiArr[i]["telephone"],
              picurl: url,
              province: poiArr[i]["_province"],
              city: poiArr[i]["_city"],
              district: poiArr[i]["_district"],
              distance: distance,
              width: otherparam["width"],
              height: otherparam["height"],
              scale: otherparam["scale"],
            }
            j++;
          }
          outputRes.originalData.datas=[];
          if (parameters['page']&&parameters['page']!=1){
            
              try {
                var pointlist = wx.getStorageSync('pointlist');
                if (pointlist) {
                  // Do something with return value
                  let newlist = pointlist;
                 // newlist.originalData.datas = pointlist.originalData.datas.concat(outputRes.originalData.datas);
                  newlist.wxMarkerData = pointlist.wxMarkerData.concat(outputRes.wxMarkerData);                  
                  wx.setStorage({
                    key: "pointlist",
                    data: newlist
                  })            
                  otherparam.success(newlist);
                }

              } catch (e) {
                // Do something when catch error
                console.log(e);
              }
              if (pointlist) return;
          }
          wx.setStorage({
            key: "pointlist",
            data: outputRes
          })
          otherparam.success(outputRes);
        } else {
          otherparam.fail({
            errMsg: res["info"],
            statusCode: res["status"]
          });
        }
      },
      fail:function(data) {
        otherparam.fail(data);
      }
    })
  }
  aroundSearch(param) {
    var that = this;
    param = param || {};
    let time = Date.parse(new Date())/1000;
    try {
      var value = wx.getStorageSync('time')
      if (value) {
        // Do something with return value
        if (time > (value + 300)) {
          wx.removeStorage({
            key: 'center',
            success: function (data) {
              console.log(data)
            }
          });
          wx.removeStorage({
            key: 'time',
            success: function (data) {
              console.log(data)
            }
          })        
        }else {
          try {
            var value1 = wx.getStorageSync('center')
            if (value1) {
              // Do something with return value              
              param["center"] = value1;
            }
          } catch (e) {
            // Do something when catch error
            console.log(e);
          }
        }
      }else{
        console.log(111);
      }
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }   
    let searchparam = {
      key: that.ak,
      tableid: that.tableid,
      center:param['center'] || '',
      radius: param['radius'] || 10000,
      filter: param['filter'] || '',
      sortrule: param['sortrule'] || '',
      limit: param['limit'] || 20,
      page: param['page'] || 1,
    };
    let otherparam = {
      iconPath: param["iconPath"] || '../../resources/marker.png',
      //iconTapPath: param["iconTapPath"],
      width: param["width"]||22,
      height: param["height"]||32,      
      success: param["success"] || function () { },
      fail: param["fail"] || function () { },
      scale: param["scale"] || 18
    };
    let type = 'gcj02';
    let url ='https://yuntuapi.amap.com/datasearch/around';
    let locationsuccess = function (result) {      
      if(result){
        searchparam["center"] = result["longitude"] + ',' + result["latitude"];
        wx.setStorage({
          key: "center",
          data: searchparam["center"]
        });
        wx.setStorage({
          key: "time",
          data: time
        });        
      }else{
        //searchparam["center"] = '116.409405,39.902882';
      }

      if (param['tag']) {
        try {
          var pointlist = wx.getStorageSync('pointlist');
          if (pointlist) {
            // Do something with return value            
            otherparam.success(pointlist);
            //console.log('here');
          }

        } catch (e) {
          // Do something when catch error
          console.log(e);
        }
        if (pointlist) return;
      }

      
      that.getMapPoint(url, searchparam, otherparam);    
    };
    let locationfail = function (result) {
      //console.log(result);
        //otherparam.fail(result);
        searchparam["center"] = '116.409405,39.902882';
        locationsuccess();
    };
    let locationcomplete = function (result) {
    };
 
    //console.log(param["center"]);
    if (!param["center"]) {
      that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
    } else {
      //let longitude = param.split(',')[1];
      //let latitude = param.split(',')[0];
     // let errMsg = 'input location';
     // let res = {
    //    errMsg: errMsg,
     //   latitude: latitude,
     //   longitude: longitude
    //  };
     // locationsuccess(res);
      searchparam["center"] = param["center"];
      locationsuccess();
    }
  }
  dataSearch(param){
    var that = this;
    param = param || {};
    try {
      let value = wx.getStorageSync('center')
      if (value) {
        // Do something with return value              
        param["center"] = value;
      }
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
    let searchparam = {
      key: that.ak,
      tableid: that.tableid,    
      keywords: param['keywords'] || '',
      city: param['city'] || '',
      filter: param['filter'] || '',
      sortrule: param['sortrule'] || '',
      limit: param['limit'] || 20,
      page: param['page'] || 1
    };
    let otherparam = {
      iconPath: param["iconPath"] || '../../resources/marker.png',
      center: param['center'] || '',
      width: param["width"] || 22,
      height: param["height"] || 32, 
      success: param["success"] || function () { },
      fail: param["fail"] || function () { },
      scale: param["scale"] || 18
    };
    let url ='https://yuntuapi.amap.com/datasearch/local';

    that.getMapPoint(url, searchparam, otherparam);
  }
  areaSearch(param){
    var that = this;
    param = param || {};
    if (param['type'] =='province'){
      var url = 'https://yuntuapi.amap.com/datasearch/statistics/province';
      var searchparams = {
        key: that.ak,
        tableid: that.tableid,
        filter: param['filter'] || '',
      //  callback: param['callback'] || '',
      };
    } else if (param['type'] == 'city'){
      var url = 'https://yuntuapi.amap.com/datasearch/statistics/city';
      var searchparams = {
        key: that.ak,
        tableid: that.tableid,
        province: param['province'] || '',
        filter: param['filter'] || '',
       // callback: param['callback'] || '',
      };
    } else if (param['type'] == 'district'){
      var url = 'https://yuntuapi.amap.com/datasearch/statistics/district';
      var searchparams = {
        key: that.ak,
        tableid: that.tableid,
        province: param['province'] || '',
        city: param['city'] || '',
        filter: param['filter'] || '',
       // callback: param['callback'] || '',
      };
    }else{
      return('none');
    }
    var back = {
      success: param["success"] || function () { },
      fail: param["fail"] || function () { },
    };
    wx.request({
      url: url,
      data: searchparams,
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {

        let res = data["data"];
        if (res['status'] == 1) {
          let province = res['datas'];
          let list = [];
          for (let i = 0; i < province.length; i++) {

            if (param['type'] == 'city') {
              list[0] = {
                id: 0,
                province: searchparams['province'],
                name:'全省',               
                style: ''
              };
              list[i+1] = {
                id : i+1,
                province: searchparams['province'],
                name : province[i].name,
                style : ''
              }
            } else if (param['type'] == 'district'){
              list[0] = {
                id: 0,
                province: searchparams['province'],
                city: searchparams['city'],
                name: '全市',
                style: ''
              };
              if (province[i].count!='0')
              list[i+1] = {
                id: i+1,
                province: searchparams['province'],
                city: searchparams['city'],
                name: province[i].name,
                style: ''
              }

            }else{
              list[i] = {
                id: i,
                name: province[i].name,
                style: ''
              }
            }
          }
          back.success(list);
        }else{
          back.fail({
            errMsg: res["info"],
            statusCode: res["status"]
          });
        }
      },
      fail:function(data){
        back.fail(data);
      }
    })
  }
  
}
module.exports.PMapWX = PMapWX;