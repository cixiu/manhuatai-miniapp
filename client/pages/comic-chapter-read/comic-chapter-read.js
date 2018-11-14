const cache = require('../../utils/cache');
const apiBookshelf = require('../../api/bookshelf');

const app = getApp();

// 定义一个全局索引 用来存储pushImageToView 所需的index
let nextChapterIndex = 0;
// 定义一个全局索引 表示正在阅读的章节的索引 方便在页面卸载是将正在阅读的章节存入storage
let readingChapterIndex = 0;
// 定义一个全局数组 表示已经阅读过的章节
let hasReadChapterList = [];

Page({
  data: {
    userInfo: {},
    comic_id: 0,
    comic_name: '',
    chapter_topic_id: 0,
    comicChapterList: [],
    imageViews: [],
    chapterIndex: 0, // 从漫画详情中进入阅读页面的时候的章节索引
    // listHeight: [0],
  },
  onLoad: function(query) {
    // TODO: 待重构
    // TODO: 如果app.globalData.comicChapterList没有数据 则请求
    wx.showLoading({
      title: '图片加载中...',
    });

    const imageViews = [];
    const chapter_topic_id = Number(query.chapter_topic_id);
    const comic_id = Number(query.comic_id);
    const readingChapter = app.globalData.comicChapterList.find((item) => {
      return item.chapter_topic_id === chapter_topic_id;
    });
    const chapterIndex = app.globalData.comicChapterList.findIndex((item) => {
      return item.chapter_topic_id === chapter_topic_id;
    });

    // 将初始化的chpaterIndex 赋值给nextChapterIndex 和 readingChapterIndex
    nextChapterIndex = chapterIndex;
    readingChapterIndex = chapterIndex;

    // 每次进入 需要先读取storage
    const historyReads = cache.loadHistoryRead();
    const comic = historyReads.find((item) => {
      return item.comic_id === comic_id;
    });

    if (!comic) {
      hasReadChapterList = [];
    } else {
      hasReadChapterList = comic.has_read_chapters;
    }

    if (hasReadChapterList.indexOf(chapter_topic_id) < 0) {
      hasReadChapterList.push(chapter_topic_id);
    }

    // 将章节图片push到imageViews中
    const len = readingChapter.start_num + readingChapter.end_num;
    const imgHost = 'https://mhpic.jumanhua.com';

    for (let i = 1; i < len; i++) {
      const img_url = readingChapter.chapter_image.middle
        .replace('$$', i)
        .replace('.webp', '.jpg');
      imageViews.push(`${imgHost}${img_url}`);
    }

    this.data.imageViews.push(imageViews);
    this.setData({
      userInfo: cache.loadUserInfo(),
      comic_id: Number(query.comic_id),
      comic_name: query.comic_name,
      chapter_topic_id,
      comicChapterList: app.globalData.comicChapterList,
      imageViews: this.data.imageViews,
      chapterIndex,
    });
    this._setNavigationBarTitle(readingChapter.chapter_name);
  },
  // 页面卸载时，将正在阅读的章节存入storage
  onUnload: function() {
    const userInfo = this.data.userInfo;
    const readingChapter = this.data.comicChapterList[readingChapterIndex];
    const img_url = 'https://image.samanlehua.com/mh/{0}.jpg-480x640.jpg.webp';
    const comicReadData = {
      comic_id: this.data.comic_id,
      comic_name: this.data.comic_name,
      chapter_name: readingChapter.chapter_name,
      read_time: +new Date(),
      chapter_topic_id: readingChapter.chapter_topic_id,
      has_read_chapters: hasReadChapterList,
      comic_img: img_url.replace('{0}', this.data.comic_id),
    };

    // 如果用户登录了，则同步阅读记录到线上
    if (userInfo.Uname) {
      const requestData = {
        type: 'mkxq',
        openid: userInfo.openid,
        myuid: userInfo.Uid,
        comic_id: this.data.comic_id,
        chapter_id: readingChapter.chapter_topic_id,
        chapter_name: readingChapter.chapter_name,
        chapter_page: 1,
      };

      apiBookshelf.addUserRead(requestData);
    }

    cache.saveHistoryRead(comicReadData);
  },
  // 滚动监听
  onPageScroll: function(pos) {
    const scrollTop = pos.scrollTop;
    const listHeight = this.listHeight;
    for (let i = 0, len = listHeight.length - 1; i < len; i++) {
      const height1 = listHeight[i];
      const height2 = listHeight[i + 1];
      // 如果scrollTop落在某一个章节的高度区间，则将导航的标题设置成章节的名字
      // 并将章节加入已阅读列表
      if (scrollTop >= height1 && scrollTop < height2) {
        readingChapterIndex = this.data.chapterIndex - i;
        const readingChapter = this.data.comicChapterList[readingChapterIndex];

        if (hasReadChapterList.indexOf(readingChapter.chapter_topic_id) < 0) {
          hasReadChapterList.push(readingChapter.chapter_topic_id);
        }

        this._setNavigationBarTitle(readingChapter.chapter_name);
      }
    }
  },
  // 监听用户上拉触底事件
  onReachBottom: function() {
    this.pushImageToView();
  },
  // 图片加载完成后计算章节的高度区间
  imgLoad: function(e) {
    wx.hideLoading();
    this._calculateHeight();
  },
  // push 下一章节图片至imageViews中
  pushImageToView: function() {
    let imageViews = [];
    nextChapterIndex--;
    const nextChapter = this.data.comicChapterList[nextChapterIndex];
    if (!nextChapter) {
      return;
    }

    const len = nextChapter.start_num + nextChapter.end_num;
    const imgHost = 'https://mhpic.jumanhua.com';
    for (let i = 1; i < len; i++) {
      const img_url = nextChapter.chapter_image.middle
        .replace('$$', i)
        .replace('.webp', '.jpg');
      imageViews.push(`${imgHost}${img_url}`);
    }
    this.data.imageViews.push(imageViews);
    this.setData({
      imageViews: this.data.imageViews,
    });
  },
  // 计算各个区块的高度
  _calculateHeight: function() {
    wx.createSelectorQuery()
      .selectAll('.chapter-image')
      .boundingClientRect((rect) => {
        let listHeight = [];
        // let listHeightFlags = [];
        let height = 0;
        listHeight.push(height);
        // listHeightFlags.push(false);
        for (let i = 0; i < rect.length; i++) {
          const item = rect[i];
          height += item.height;
          listHeight.push(height);
          // listHeightFlags.push(false);
        }
        this.listHeight = listHeight;
        // this.listHeightFlags = listHeightFlags;
        // console.log(this.listHeightFlags);
        // this.setData({
        //   listHeight,
        // });
      })
      .exec();
  },
  // 设置导航栏的title
  _setNavigationBarTitle: function(chapter_name) {
    wx.setNavigationBarTitle({
      title: chapter_name,
    });
  },
});
