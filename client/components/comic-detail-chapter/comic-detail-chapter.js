const filter = require('../../utils/filter');

Component({
  data: {
    comicChapterList: [],
    sortOrder: 1, // 1: 升序  -1: 降序
    showAll: false,
    chapterTitltTop: 0,
    titleFixed: false,
  },
  properties: {
    comicId: {
      type: Number,
      value: 0,
    },
    comicInfoBody: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_chapter) {
          const copyComicChapterList = filter.deepClone(newVal.comic_chapter);
          this.setData({
            comicChapterList: copyComicChapterList.slice(0, 5).reverse(),
          });
        }
      },
    },
    commentCount: {
      type: Number,
      value: 0,
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer: function(newVal) {
        console.log(newVal);
      },
    },
  },
  ready: function() {
    this.createSelectorQuery()
      .select('.chapter-title')
      .boundingClientRect((rect) => {
        this.setData({
          chapterTitltTop: rect.top,
        });
      })
      .exec();
  },
  methods: {
    // 改变漫画章节的排序方式
    changeSort: function() {
      const comicChapterList = this.data.comicChapterList.reverse();
      if (this.data.sortOrder === 1) {
        this.setData({
          sortOrder: -1,
          comicChapterList,
        });
      } else {
        this.setData({
          sortOrder: 1,
          comicChapterList,
        });
      }
    },
    // 展开章节列表，显示全部的章节
    openAllChapter: function() {
      let comicChapterList = [];
      const copyComicChapterList = filter.deepClone(
        this.properties.comicInfoBody.comic_chapter,
      );
      if (this.data.sortOrder === 1) {
        comicChapterList = copyComicChapterList.reverse();
      } else {
        comicChapterList = copyComicChapterList;
      }
      this.setData({
        comicChapterList,
        showAll: true,
      });
    },
    // 收起章节列表，只显示5条数据
    closeAllChapter: function() {
      const copyComicChapterList = filter.deepClone(
        this.properties.comicInfoBody.comic_chapter,
      );
      if (this.data.sortOrder === 1) {
        this.setData({
          comicChapterList: copyComicChapterList.slice(0, 5).reverse(),
          showAll: false,
          titleFixed: false,
        });
      } else {
        this.setData({
          comicChapterList: copyComicChapterList.slice(0, 5),
          showAll: false,
          titleFixed: false,
        });
      }
      wx.pageScrollTo({
        scrollTop: this.data.chapterTitltTop
      })
    },
    // 监听滚动
    listenScroll: function(scrollTop) {
      if (
        scrollTop >= this.data.chapterTitltTop &&
        !this.data.titleFixed &&
        this.data.showAll
      ) {
        this.setData({
          titleFixed: true,
        });
      } else if (scrollTop < this.data.chapterTitltTop && this.data.titleFixed) {
        this.setData({
          titleFixed: false,
        });
      }
    },
  },
});
