const apiComicDetail = require('../../api/comic-detail');
const filter = require('../../utils/filter');
const cache = require('../../utils/cache');

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
    loading: true,
  },
  onLoad: function(query) {
    const comic_id = +query.comicId; // 将字符串转成数字类型
    this.initFetch(comic_id);
  },
  // 页面显示/切入前台时 设置已经阅读过的章节的flag标记
  onShow: function() {
    this._setChapterReadFlag(this.data.comicInfoBody);
  },
  // 监听用户点击页面内转发按钮
  onShareAppMessage: function() {
    return {
      title: this.data.comicInfoBody.comic_name,
      path: `/pages/comic-detail/comic-detail?comicId=${this.data.comic_id}`,
    };
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.initFetch(this.data.comic_id, () => {
      wx.stopPullDownRefresh();
    });
  },
  // 监听滚动
  onPageScroll: function(res) {
    this.selectComponent('#comic-detail-chapter').listenScroll(res.scrollTop);
  },
  // 初始化数据
  initFetch: function(comic_id, callback) {
    const imgHost = app.globalData.imgHost;
    // jpg格式
    const image_size_suffix = app.globalData.config.image_size_suffix;

    // webp格式
    // const image_size_suffix = app.globalData.config.image_size_webp;

    this.getComicInfoBody(comic_id, callback);
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
  // 获取指定漫画的主体信息
  getComicInfoBody: function(comic_id, callback) {
    apiComicDetail.getComicInfoBody(comic_id, (res) => {
      this._setChapterReadFlag(res.data);
      // 主体信息获取完成后则隐藏loading
      this.setData({
        loading: false,
      });
      app.globalData.comicChapterList = res.data.comic_chapter;

      callback && callback();
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
    // 通过authcode 获取该漫画的的推荐列表
    apiComicDetail.getBookByComicid(comic_id, userauth, (res) => {
      if (res.data.status === 0) {
        this.setData({
          bookList: res.data.data,
        });
      }
    });
  },
  // 将漫画章节列表添加has_read 字段，用于判断是否是已经读过
  _setChapterReadFlag: function(comicInfoBody) {
    if (comicInfoBody.comic_name) {
      // 动态设置当前页面的标题。
      wx.setNavigationBarTitle({
        title: comicInfoBody.comic_name,
      });
    }
    if (!this.data.comicInfoBody.comic_name) {
      const copyComicInfoBody = filter.deepClone(comicInfoBody);
      this.setData({
        comicInfoBody: copyComicInfoBody,
      });
    }
    const comic_chapter = this.data.comicInfoBody.comic_chapter;

    if (comic_chapter) {
      const historyReads = cache.loadHistoryRead() || [];
      const comic = historyReads.find((item) => {
        return item.comic_id === this.data.comic_id;
      });

      if (comic) {
        const dataObj = {};
        for (const chapter_topic_id of comic.has_read_chapters) {
          const chapterIndex = comic_chapter.findIndex((comic_item) => {
            return comic_item.chapter_topic_id === chapter_topic_id;
          });
          if (chapterIndex > -1) {
            dataObj[
              `comicInfoBody.comic_chapter[${chapterIndex}].has_read`
            ] = true;
          }
        }
        this.setData(dataObj);

        // const newComicChapter = comic_chapter.map((item) => {
        //   if (comic.has_read_chapters.indexOf(item.chapter_topic_id) > -1) {
        //     item.has_read = true;
        //   } else {
        //     item.has_read = false;
        //   }
        //   return item;
        // });
        // copyComicInfoBody.comic_chapter = newComicChapter;
      }
      // this.setData({
      //   comicInfoBody: copyComicInfoBody,
      // });
    }
  },
});
