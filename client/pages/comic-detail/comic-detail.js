const apiComicDetail = require('../../api/comic-detail');
const apiUser = require('../../api/user');
const filter = require('../../utils/filter');

const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    comic_id: 0,
    coverImage: '',
    coverImageBg: '',
    comicInfoBody: {},
    comicInfoRole: [],
    fansList: [],
    influenceData: {},
    commentCount: 0,
    bookList: [],
  },
  onLoad: function(query) {
    const comic_id = +query.comicId; // 将字符串转成数字类型
    const imgHost = app.globalData.imgHost;
    const image_size_suffix = app.globalData.config.image_size_suffix;
    this.getComicInfoBody(comic_id);
    this.getComicInfoRole(comic_id);
    this.getComicInfoInfluence(comic_id);
    this.getComicCommentCount(comic_id);
    const { comicUserInfo } = app.globalData;
    if (comicUserInfo) {
      this.getComicUserInfo(comic_id, comicUserInfo.task_data.authcode);
    } else {
      app.comicUserInfoCallback = (data) => {
        this.getComicUserInfo(comic_id, data.task_data.authcode);
      };
    }
    this.setData({
      comic_id,
      coverImage: `${imgHost}/mh/${comic_id}.jpg${image_size_suffix['m3x4']}`,
      coverImageBg: `${imgHost}/mh/${comic_id}_2_1.jpg${
        image_size_suffix['m2x1']
      }`,
    });
  },
  onPageScroll: function(res) {
    this.selectComponent('#comic-detail-chapter').listenScroll(res.scrollTop);
  },
  // 获取指定漫画的主体信息
  getComicInfoBody: function(comic_id) {
    apiComicDetail.getComicInfoBody(comic_id, (res) => {
      // 动态设置当前页面的标题。
      wx.setNavigationBarTitle({
        title: res.data.comic_name,
      });
      this.setData({
        comicInfoBody: res.data,
      });
      app.globalData.comicChapterList = res.data.comic_chapter;
    });
  },
  // 获取指定漫画的作者和角色信息
  getComicInfoRole: function(comic_id) {
    apiComicDetail.getComicInfoRole(comic_id, (res) => {
      const comicInfoRole = res.data.data.slice(0, 4).map((item) => {
        // webp格式的http图片链接 转成 https和jgp格式的图片外链
        item.sculpture = item.sculpture.replace(
          /^(http)(.*?)(\.webp)$/g,
          (match, ...arg) => {
            return `https${arg[1]}`;
          },
        );
        return item;
      });
      this.setData({
        comicInfoRole,
      });
    });
  },
  // 获取指定漫画的人气活跃数据
  getComicInfoInfluence: function(comic_id) {
    apiComicDetail.getComicInfoInfluence(comic_id, (res) => {
      const topThreeFans = res.data.data.insider_list.slice(0, 3);
      const fansList = filter.filterFansList(topThreeFans);
      this.setData({
        fansList,
        influenceData: res.data.data.call_data,
      });
    });
  },
  // 获取指定漫画的评论(吐槽)数量
  getComicCommentCount: function(comic_id) {
    apiComicDetail.getComicCommentCount(comic_id, (res) => {
      this.setData({
        commentCount: res.data.data,
      });
    });
  },
  // 此为漫画台测试的用户信息，目的是获取一些api接口需要的authcode
  getComicUserInfo: function(comic_id, userauth) {
    apiComicDetail.getBookByComicid(comic_id, userauth, (res) => {
      this.setData({
        bookList: res.data.data,
      });
    });
  },
});
