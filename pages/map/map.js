//index.js
//获取应用实例
var pmap = require('../../libs/mapapi.js');
var app = getApp();
var wxMarkerData = [];
Page({
  data: {    
    condition:false,
    latitude: '39.902882',
    longitude: '116.409405',
    version: app.globalData.deviceinfo.SDKVersion || '1.0.0',
    scale: 10,
    id:0,
    checkscale:0,
    title:'',
    active: [],
    markers: [],
    controls: [
    {
      id: 0,
      iconPath: '../../resources/axl.png',
      position: {
        left: 10,
        top: app.globalData.deviceinfo.windowHeight - 170 || 1000,
        height: 40,
        width: 40
      },
      clickable: false
    },
    {
      id: 1,
      iconPath: '../../resources/a1b.png',
      position: {
        left: 10,
        top: app.globalData.deviceinfo.windowHeight - 170 || 1000,
        width: 40,
        height: 40
      },
      clickable: true
    }]

  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');   
  },
  onLoad: function (option) {
    var that = this; 
    var tag = option.tag;
    if(tag){
      let key = option.active;    
      let obj = { key: 'active', 'on': key };
      obj[key] = obj['key'];
      delete obj['key'];
      that.setData({
        active: obj,
        title: option.title
      });
    }  
    var PMap = new pmap.PMapWX({
      ak: '71a4cd93ba3ba92ccba2161*******',
      tableid:'55273bf0e4b0bfcd7*******'
    });
    var fail = function (data) {
      console.log(data)
    };   
    var success = function (data) {      
      wxMarkerData = data.wxMarkerData;
      
      if(wxMarkerData.length!=0){              
        that.changeMarkerColor(wxMarkerData, 0);
        that.setData({
          markers: wxMarkerData,
          latitude: wxMarkerData[0].latitude,
          longitude: wxMarkerData[0].longitude,
          scale: 13
        });
      }else{ 
        var lat =data.center.split(',')[1];
        var lon = data.center.split(',')[0];
        that.setData({                   
          latitude: lat,
          longitude: lon,
          scale: 13
        });
        wx.showToast({
          title: '没找到店铺',
          icon: 'loading',
          duration: 2000
        })               
      }
    }
    PMap.aroundSearch({      
      fail: fail,
      success: success,
      iconPath: '../../resources/marker.png', 
      radius:10000,    
      height:32,
      width:22,
      tag:tag
    });
  },
  markertap(e) {    
    var id = e.markerId;
    var that = this;
    that.setData({
     // latitude: wxMarkerData[id].latitude,
    //  longitude: wxMarkerData[id].longitude,
    });
    that.changeMarkerColor(wxMarkerData, id);
  },
  controltap(e) {
    var id = e.controlId;
    var that = this;
    if(id==1){
      that.moveToLocation(that.data.controls, id);
    }else{

    }
  },
  regionchange(e){ 
    var that = this; 
    if (e.type == 'begin') {
      that.mapchange(that.data.controls);
    } 
  },
  swiperchange(e){     
    var that = this;
    if (e.type == 'change') {
      var id = e.detail.current;
      that.changeMarkerColor(wxMarkerData, id);
    }   
  },
  roadtap(e){
    //console.log(e);
    var id = e.currentTarget.id;
    var latitude = parseFloat(wxMarkerData[id].latitude);
    var longitude = parseFloat(wxMarkerData[id].longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: wxMarkerData[id].shopname,
      address: wxMarkerData[id].address,
      scale: 18
    })
  },
  detailtap(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  },
  changeMarkerColor: function (data, id) {
    var that = this;
    var markersTemp = [];
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "../../resources/marker_checked.png";      
      } else {
        data[i].iconPath = "../../resources/marker.png";
      }
      markersTemp[i] = data[i];
    }
   // console.log(markersTemp);
    that.setData({
      markers: markersTemp,
      latitude: data[id].latitude,
      longitude: data[id].longitude,
      id:id
    });
  },
  moveToLocation: function (data,id) {
    var that = this;
    var controlsTemp = [];
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = '../../resources/a1b.png';
      }
      controlsTemp[i] = data[i];   
    }
    that.setData({

      controls: controlsTemp,
      condition:true
    });
    that.mapCtx.moveToLocation();
  },
  mapchange:function(data){
    var that = this;   
    var controlsTemp = [];
    if(that.data.condition){
      that.setData({
        condition: false,
      });    
    }else{
      for (var i = 0; i < data.length; i++) {
        if (i === 1) {
          data[i].iconPath = '../../resources/a1c.png';
        }
        controlsTemp[i] = data[i];
      }
      that.setData({
        controls: controlsTemp,
        condition: false
      });        
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '凤凰飞镖地图小程序',
      path: '/pages/lists/lists',
      imageUrl: '/resources/share.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
