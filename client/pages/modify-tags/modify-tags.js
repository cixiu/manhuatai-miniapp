const userCenterApi = require('../../api/user-center');

const app = getApp();

Page({
  data: {
    loading: true,
    tagsList: [],
  },
  onLoad: function() {
    this.userInfo = app.globalData.comicUserInfo;
    // 获取所有的标签列表
    userCenterApi.getTagsList((res) => {
      if (res.data.status === 0) {
        const userid = this.userInfo.Uid;
        let tagsList = res.data.data;
        // 获取用户的标签列表
        userCenterApi.getTagsInfo(userid, (resp) => {
          if (resp.data.status === 0) {
            const userTagsList = resp.data.data;

            tagsList = tagsList.map((item) => {
              if (userTagsList && userTagsList.length > 0) {
                const index = userTagsList.findIndex((tag) => {
                  return tag.id === item.id;
                });

                if (index >= 0) {
                  item.isSelected = true;
                }
              }

              return item;
            });

            this.setData({
              loading: false,
              tagsList,
            });
          }
        });
      }
    });
  },
  // 选择标签
  choseTag: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`tagsList[${index}].isSelected`]: !this.data.tagsList[index].isSelected,
    });
  },
  // 选好了之后，确认修改
  confirmModify: function() {
    const extarTagIds = [];
    this.data.tagsList.forEach((item) => {
      if (item.isSelected) {
        extarTagIds.push(item.id);
      }
    });

    wx.showLoading({
      title: '正在接入...',
      mask: true,
    });

    const requestData = {
      userauth: this.userInfo.task_data.authcode,
      type: 1,
      extraid: JSON.stringify(extarTagIds),
    };

    userCenterApi.addUserTags(
      requestData,
      (res) => {
        if (res.data.status === 0) {
          app.globalData.isModifyUserInfo = true;

          wx.hideLoading();
          wx.navigateBack({
            delta: 1,
          });
          // wx.showToast({
          //   title: '保存成功',
          //   success: () => {
          //     setTimeout(() => {

          //     }, 1500);
          //   },
          // });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          });
        }
      },
      () => {
        wx.showToast({
          title: '数据请求失败，请重试',
          icon: 'none',
        });
      },
    );
  },
});
