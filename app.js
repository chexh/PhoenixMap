//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    wx.getSystemInfo({      
      success: function (res) {
        that.globalData.deviceinfo = res
      }
    })
  },
  globalData: {
    deviceinfo: null
  }
})