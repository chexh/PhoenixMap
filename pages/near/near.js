// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var center;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["公交", "地铁"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0 ,
    bus:[],
    subway:[] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    }); 
    var detail = JSON.parse(options.detail);
    center = detail.latitude + ',' + detail.longitude;    
    qqmapsdk = new QQMapWX({
      key: 'UMFBZ-3D4HW-H5JRD-RSAOE-5LWWZ-HWBAC'
    });
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });     
    qqmapsdk.search({
      keyword: '公交',
      location: center,
      page_size:20,
      distance:100,
      auto_extend:0,
      filter:'category=公交车站',
      success: function (res) { 
        //console.log(res);       
        wx.hideToast();
        if (res.count == 0) {
          wx.showModal({
            title: '提示',
            content: '附近没有公交车站',
            showCancel: false,
            success: function (res) {
            }
          })
        }
        that.setData({
          bus:res.data
        });
      },
      fail: function (res) {
        console.log(res);
        wx.hideToast();
      }
    })    
  },
  tabClick: function (e) {
    var that = this;
    console.log(e.currentTarget.id);
    if (e.currentTarget.id && !that.data.subway.length ){
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
      });
      qqmapsdk.search({
        keyword: '地铁',
        location: center,
        page_size: 20,
        distance: 100,
        auto_extend: 0,
        filter: 'category=地铁站',
        success: function (res) {
          //console.log(res);
          wx.hideToast();
          if(res.count==0){
            wx.showModal({
              title: '提示',
              content: '附近没有地铁站',
              showCancel: false,
              success: function (res) {  
              }
            })
          }
          that.setData({
            subway: res.data
          });
        },
        fail: function (res) {
          console.log(res);
          wx.hideToast();
        }
      }) 
    } 
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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