const cache = require('../../utils/cache');

Component({
  data: {
    readComic: {},
  },
  properties: {
    comicId: {
      type: Number,
      value: 0,
    },
    influenceData: {
      type: Object,
      value: {},
    },
    commentCount: {
      type: Number,
      value: 0,
    },
    comicInfoBody: {
      type: Object,
      value: {},
    },
  },
  pageLifetimes: {
    show: function() {
      const historyReads = cache.loadHistoryRead() || [];
      const comic = historyReads.find((item) => {
        return item.comic_id === this.properties.comicId;
      });
      if (comic) {
        this.setData({
          readComic: comic,
        });
      }
    }
  },
  methods: {
    goToChapterRead: function() {
      const comicId = this.properties.comicId;
      const comicInfoBody = this.properties.comicInfoBody;
      const comicChapter = comicInfoBody.comic_chapter;
      const chapter_topic_id = this.data.readComic.chapter_topic_id
        ? this.data.readComic.chapter_topic_id
        : comicChapter[comicChapter.length - 1].chapter_topic_id;
      const url = `/pages/comic-chapter-read/comic-chapter-read?comic_id=${comicId}&comic_name=${
        comicInfoBody.comic_name
      }&chapter_topic_id=${chapter_topic_id}`;

      wx.navigateTo({
        url,
      });
    },
  },
});
