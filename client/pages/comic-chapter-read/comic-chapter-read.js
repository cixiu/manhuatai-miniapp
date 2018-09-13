const app = getApp();

// 定义一个全局索引 用来存储pushImageToView 所需的index
let readingChapterIndex = 0;

Page({
  data: {
    comic_id: 0,
    comic_name: '',
    chapter_topic_id: 0,
    comicChapterList: [],
    imageViews: [],
    chapterIndex: 0, // 从漫画详情中进入阅读页面的时候的章节索引
    listHeight: [0],
  },
  onLoad: function(query) {
    const imageViews = [];
    const readingChapter = app.globalData.comicChapterList.find((item) => {
      return item.chapter_topic_id === Number(query.chapter_topic_id);
    });
    const chapterIndex = app.globalData.comicChapterList.findIndex((item) => {
      return item.chapter_topic_id === Number(query.chapter_topic_id);
    });
    // 将初始化的chpaterIndex 赋值给readingChapterIndex
    readingChapterIndex = chapterIndex;
    const len = readingChapter.start_num + readingChapter.end_num;
    const imgHost = 'https://mhpic.jumanhua.com';
    for (let i = 1; i < len; i++) {
      const img_url = readingChapter.chapter_image.middle.replace('$$', i);
      imageViews.push(`${imgHost}${img_url}`);
    }
    this.data.imageViews.push(imageViews);
    this.setData({
      comic_id: Number(query.comic_id),
      comic_name: query.comic_name,
      chapter_topic_id: Number(query.chapter_topic_id),
      comicChapterList: app.globalData.comicChapterList,
      imageViews: this.data.imageViews,
      chapterIndex,
    });
    this._setNavigationBarTitle(readingChapter.chapter_name);
  },
  // 滚动监听
  onPageScroll: function(pos) {
    let scrollTop = pos.scrollTop;
    let listHeight = this.data.listHeight;
    for (let i = 0, len = listHeight.length - 1; i < len; i++) {
      let height1 = listHeight[i];
      let height2 = listHeight[i + 1];
      // 如果scrollTop落在某一个章节的高度区间，则将导航的标题设置成章节的名字
      if (scrollTop >= height1 && scrollTop < height2) {
        const readingChapter = this.data.comicChapterList[
          this.data.chapterIndex - i
        ];
        this._setNavigationBarTitle(readingChapter.chapter_name);
      }
    }
  },
  // 监听用户上拉触底事件
  onReachBottom: function() {
    this.pushImageToView();
  },
  // 图片加载完成后计算章节的高度区间
  imgLoad: function() {
    this._calculateHeight();
  },
  // push 下一章节图片至imageViews中
  pushImageToView: function() {
    let imageViews = [];
    readingChapterIndex--;
    const nextChapter = this.data.comicChapterList[readingChapterIndex];
    if (!nextChapter) {
      return;
    }
    const len = nextChapter.start_num + nextChapter.end_num;
    const imgHost = 'https://mhpic.jumanhua.com';
    for (let i = 1; i < len; i++) {
      const img_url = nextChapter.chapter_image.middle.replace('$$', i);
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
        let height = 0;
        listHeight.push(height);
        for (let i = 0; i < rect.length; i++) {
          const item = rect[i];
          height += item.height;
          listHeight.push(height);
        }
        this.setData({
          listHeight,
        });
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
