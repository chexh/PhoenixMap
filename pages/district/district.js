var pmap = require('../../libs/mapapi.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province:'',
    city:'',
    district:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var PMap = new pmap.PMapWX({
      ak: '71a4cd93ba3ba92ccba2161aeb',
      tableid: '55273bf0e4b0bfcd7f'
    });
    if (wx.getSetting){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('成功');
            },
            fail(){
              console.log('失败');
              wx.showModal({
                title: '提示',
                content: '请允许地理位置授权，否则无法获取当前位置',
                confirmText: '设置',
                success: function (res) {
                  if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          console.log(res);
                          if (!res.authSetting['scope.userLocation']) {

                          }
                        }
                      })
                  } else if (res.cancel) {
                    console.log('cancel')
                  }
                }
              });
            }
          })
        }else{
          console.log('已授权');
        }
      }
    })
    }else{
      wx.showToast({
        title: '微信版本过低！',
        icon: 'loading',
        duration: 1500
      })
    }
    var pfail = function (data) {
      wx.hideNavigationBarLoading();
      wx.hideToast();  
      console.log(data)
    };
    var psuccess = function (data) { 
     // console.log(data); 
      wx.hideToast();
      wx.hideNavigationBarLoading();  
      that.setData({
        province: data
      })
    };
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    PMap.areaSearch({
      fail: pfail,
      success: psuccess,
      type: 'province'
    });    
  },
  alltap(e){
    wx.reLaunch({
      url: '../lists/lists?district=全国'
    })    
  },
  provincetap(e) {
   // console.log(e.currentTarget.id);
    var that = this;    
    var data = that.data.province;
    for (var i = 0; i < data.length; i++) {
      if (i == e.currentTarget.id) {
        data[i].style = 'border-left: 4px solid #0091ff;background: #f1f1f1;font-weight: bold;color:#3b3b3b;padding-left: 15px';

      }else{
        data[i].style ='';
      }
    }    
    that.setData({
      province: data,
      city: '',
      district:'',
    })
    that.showCity(e.currentTarget.id, data[e.currentTarget.id].name );
  },
  citytap(e) {
    var that = this;
    var data = that.data.city;
    if(e.currentTarget.id=='0'){      
      let province = data[0].province;
      wx.reLaunch({
        url: '../lists/lists?district=' + province
      })
      return;
    }

    for (var i = 0; i < data.length; i++) {
      if (i == e.currentTarget.id) {
        data[i].style = 'font-weight: bold;color:#0091ff;';

      } else {
        data[i].style = '';
      }
    }
    that.setData({
      city: data
    })
    that.showDistrict(e.currentTarget.id, data[e.currentTarget.id].province, data[e.currentTarget.id].name);
  },
  districtap(e){
    var that = this;   
    var data = that.data.district;
    var id = e.currentTarget.id;
    if (id == '0') {
      let city = data[0].province + data[0].city;
      wx.reLaunch({
        url: '../lists/lists?district=' + city
      })
    }else{
      let district = data[id].province + data[id].city + data[id].name;
      wx.reLaunch({
        url: '../lists/lists?district=' + district
      })     
    }    
  },
  showCity: function (id,province){
    var that = this;
    var PMap = new pmap.PMapWX({
      ak: '71a4cd93ba3ba92ccba2161aebb',
      tableid: '55273bf0e4b0bfcd7f2'
    });
    var cfail = function (data) {
      wx.hideNavigationBarLoading(); 
      wx.hideToast(); 
      console.log(data)
    };
    var csuccess = function (data) {
      //console.log(data);
      wx.hideNavigationBarLoading();
      wx.hideToast();  
      that.setData({
        city: data
      })
    };
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    PMap.areaSearch({
      fail: cfail,
      success: csuccess,
      type: 'city',
      province: province
    });
  },
  showDistrict: function (id, province,city) {
    var that = this;
    var PMap = new pmap.PMapWX({
      ak: '71a4cd93ba3ba92ccba2161aeb',
      tableid: '55273bf0e4b0bfcd7f2'
    });
    var dfail = function (data) {
      console.log(data)
      wx.hideNavigationBarLoading(); 
      wx.hideToast(); 
    };
    var dsuccess = function (data) {
      //console.log(data);
      wx.hideNavigationBarLoading(); 
      wx.hideToast(); 
      that.setData({
        district: data
      })
    };
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    PMap.areaSearch({
      fail: dfail,
      success: dsuccess,
      type: 'district',
      province: province,
      city: city
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
