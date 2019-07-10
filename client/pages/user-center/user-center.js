const filter = require('../../utils/filter');
const userCenterApi = require('../../api/user-center');

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
    userTag: '',
  },
  onLoad: function() {
    const userInfo = app.globalData.comicUserInfo;
    const id = userInfo.Uid;
    const imgHost = `${app.globalData.imgHost}/file/kanmanhua_images/head/`;
    // 生成用户的头像的url
    const Uavatar = filter.makeImgUrlById(id, imgHost, 'l1x1');

    this.setData({
      Uavatar,
      userInfo,
    });

    this.getTagsInfo();
  },
  onShow: function() {
    if (app.globalData.isModifyUserInfo) {
      this.setData({
        userInfo: app.globalData.comicUserInfo,
      });

      this.getTagsInfo();

      wx.showToast({
        title: '修改成功',
      });
    }
  },
  // 获取用户的标签列表
  getTagsInfo: function() {
    const userid = this.data.userInfo.Uid;
    userCenterApi.getTagsInfo(userid, (res) => {
      if (res.data.status === 0) {
        const userTagsList = res.data.data;
        let userTag = '';

        if (userTagsList.length) {
          userTagsList.forEach((item) => {
            userTag += `、${item.title}`;
          });

          userTag = userTag.substring(1);
        }

        this.setData({
          userTag,
        });
      }
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
