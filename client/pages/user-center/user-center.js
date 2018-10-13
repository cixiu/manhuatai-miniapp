const filter = require('../../utils/filter');

const app = getApp();

/*
  个人资料的每次更改后，都需要重新拉取用户的信息并且存入storage中
*/

Page({
  data: {
    Uavatar: '',
    userInfo: {},
  },
  onLoad: function() {
    const userInfo = app.globalData.comicUserInfo;
    const id = userInfo.Uid;
    const imgHost = 'https://image.samanlehua.com/file/kanmanhua_images/head/';
    // 生成用户的头像的url
    const Uavatar = filter.makeImgUrlById(id, imgHost, 'l1x1');

    this.setData({
      Uavatar,
      userInfo,
    });
  },
});
