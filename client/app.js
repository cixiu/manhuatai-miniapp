//app.js
App({
  onLaunch: function () {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      }
    });
    // 获取漫画台主要的全局数据
    wx.request({
      method: 'GET',
      url: 'https://main-globalapi.yyhao.com/app_api/v5/getconfig/',
      data: {
        platformname: 'android',
        productname: 'mht'
      },
      success: (res) => {
        this.globalData.config = res.data
      }
    })
  },
  globalData: {
    systemInfo: null,
    config: null,
    imgHost: 'https://image.samanlehua.com',
  }
})
