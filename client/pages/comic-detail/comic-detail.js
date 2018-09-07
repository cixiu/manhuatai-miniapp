const apiComicDetail = require('../../api/comic-detail');

const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    coverImage: '',
    coverImageBg: '',
    comicInfoBody: {},
    comicInfoRole: [],
  },
  onLoad: function(query) {
    const comic_id = +query.comicId; // 将字符串转成数字类型
    const imgHost = app.globalData.imgHost;
    const image_size_suffix = app.globalData.config.image_size_suffix;
    this.getComicInfoBody(comic_id);
    this.getComicInfoRole(comic_id);
    this.setData({
      coverImage: `${imgHost}/mh/${comic_id}.jpg${image_size_suffix['m3x4']}`,
      coverImageBg: `${imgHost}/mh/${comic_id}_2_1.jpg${image_size_suffix['m2x1']}`,
    })
  },
  // 获取指定漫画的主体信息
  getComicInfoBody: function(comic_id) {
    apiComicDetail.getComicInfoBody(comic_id, (res) => {
      this.setData({
        comicInfoBody: res.data,
      });
    });
  },
  // 获取指定漫画的作者和角色信息
  getComicInfoRole: function(comic_id) {
    apiComicDetail.getComicInfoRole(comic_id, (res) => {
      this.setData({
        comicInfoRole: res.data.data,
      });
    });
  },
});
