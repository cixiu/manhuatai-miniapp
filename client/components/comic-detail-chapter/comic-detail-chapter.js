Component({
  data: {
    comicChapterList: [],
  },
  properties: {
    comicInfoBody: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_chapter) {
          this.setData({
            comicChapterList: newVal.comic_chapter.slice(0, 5),
          });
          console.log(this.data)
        }
      },
    },
  },
});
