const filter = require('../../utils/filter');

const app = getApp();

/*
  个人资料的每次更改后，都需要重新拉取用户的信息并且存入storage中
*/

Page({
  data: {
    Uavatar: '',
    userInfo: {},
    showModifyAvatar: false,
    showModifySex: false,
    showModifyAge: false,
    date: '2016-01-01'
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
  // 修改头像
  modifyAvatar: function() {
    this.setData({
      showModifyAvatar: true,
    });
  },
  // 取消修改头像
  cancelModifyAvatar: function() {
    this.setData({
      showModifyAvatar: false,
    });
  },
  // 修改性别
  modifySex: function() {
    this.setData({
      showModifySex: true,
    });
  },
  // 修改性别成功
  confirmModifySex: function() {
    const userInfo = app.globalData.comicUserInfo;
    this.setData({
      'userInfo.Usex': userInfo.Usex,
      showModifySex: false,
    });
  },
  // 取消修改性别
  cancelModifySex: function() {
    this.setData({
      showModifySex: false,
    });
  },
  // 修改年龄
  modifyAge: function() {
    this.setData({
      showModifyAge: true,
    });
  },
  // 修改年龄成功
  confirmModifyAge: function() {
    const userInfo = app.globalData.comicUserInfo;
    this.setData({
      'userInfo.Ubirthday': userInfo.Ubirthday,
      showModifyAge: false,
    });
  },
  // 取消修改年龄
  cancelModifyAge: function() {
    this.setData({
      showModifyAge: false,
    });
  },
});
