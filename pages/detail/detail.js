Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    try {
      var value = wx.getStorageSync('pointlist')
      if (value) {
        // Do something with return value
        that.setData({
          markers: value.wxMarkerData[id]
        });
      }
    } catch (e) {
      // Do something when catch error
    }
   
  },
  daohang: function (e){
    //console.log(e.currentTarget.id);
    var that = this;
    var latitude = parseFloat(that.data.markers.latitude);
    var longitude = parseFloat(that.data.markers.longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: that.data.markers.shopname,
      address: that.data.markers.address,
      scale: 28
    })
  },
  nearby:function(e){
    var that = this;
    var detail = JSON.stringify(that.data.markers);
    wx.navigateTo({
      url: '../near/near?detail='+detail,
    });    
  },
  getchange:function(e){
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        var name = res.name
        var address = res.address
      }
    })
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