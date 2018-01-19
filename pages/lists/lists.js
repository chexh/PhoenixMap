var pmap = require('../../libs/mapapi.js');
var app = getApp();
var wxMarkerData = [];
Page({
  data: {
    version: app.globalData.deviceinfo.SDKVersion || '1.0.0',
    markers: [],
    active:[],
    loading:false,
    loadcomplete:true,
    loadend: false,
    empty:false,
    search: '',
    district:'',
    radius:'',
    title:'',
    page:1
  },
  onReady: function (e) {
  },
  onLoad: function (option) {
    var that = this;
    var tag = option.tag;
    if (option.search) {
      that.setData({
        search: option.search,
        active: { 'search': 'active', 'on':'search'},
        title: '搜索：' + option.search
      });      
    } else if (option.district){
      that.setData({
        district: option.district,
        active: { 'district': 'active', 'on': 'district'},
        title: '地区：' + option.district
      });
    } else{
      if (!option.radius) option.radius = 10000;
      that.setData({
        radius: option.radius,
        active: { 'around': 'active', 'on': 'around' },
        title: '附近：' + (option.radius/1000) + 'Km'
      });    
    }
    if (tag) {
      let key = option.active;
      let obj = { key: 'active', 'on': key };
      obj[key] = obj['key'];
      delete obj['key'];
      that.setData({
        active: obj,
        title: option.title
      });
    }
    //console.log(that.data.active);
    that.searchlist(option.search, option.district, option.radius, tag);
  },
  searchlist: function (search, district, radius, tag){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    var PMap = new pmap.PMapWX({
      ak: '71a4cd93ba3ba92ccba2161ae*******',
      tableid: '55273bf0e4b0bfcd7f*******'
    });

    var fail = function (data) {
      console.log(data);
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: '获取店铺失败，请重试！',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    };
    var success = function (data) {
      wx.hideToast();
      wxMarkerData = data.wxMarkerData;
      var count = data.originalData.count;
      if (wxMarkerData.length != 0) {
        if (count > 20 && (that.data.page * 20 < count)) {
          that.setData({
            markers: wxMarkerData,
            loading: true,
            loadcomplete: true
          });
        } else {
          that.setData({
            markers: wxMarkerData,
            loading: false,
            loadcomplete: true,
            loadend:true
          });
        }
      } else {
        that.setData({
          empty: true
        });
      }
    }
    if (search){
      PMap.dataSearch({
        fail: fail,
        success: success,
        iconPath: '../../resources/marker.png',
        keywords: that.data.search,
        city: '全国',
        filter: '',
        sortrule: '',
        limit: 20,
        page: that.data.page
      });
    } else if (district) {
      PMap.dataSearch({
        fail: fail,
        success: success,
        iconPath: '../../resources/marker.png',
        keywords: '',
        city: district,
        filter: '',
        sortrule: '',
        limit: 20,
        page: that.data.page
      });
    } else {      
      PMap.aroundSearch({
        fail: fail,
        success: success,
        iconPath: '../../resources/marker.png',
        radius: radius,
        limit: 20,
        page: that.data.page,
        tag: tag
      });
    }    
  },
  searchScrollLower: function(e){
    let that = this;
    if (that.data.loading && that.data.loadcomplete) {   
      that.setData({
        loadcomplete:false,
        page:that.data.page+1
      });
    that.searchlist(that.data.search, that.data.district, that.data.radius, 0);
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
