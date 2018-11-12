const app = getApp();

Component({
  data: {
    imgUrl: '',
  },
  properties: {
    bookData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal.title) {
          let imgUrl = '';
          const imgHost = app.globalData.imgHost;
          if (!/^\//.test(newVal.comic_info[0].img_url)) {
            imgUrl = imgHost + '/' + newVal.comic_info[0].img_url;
          } else {
            imgUrl = imgHost + newVal.comic_info[0].img_url;
          }
          this.setData({
            imgUrl,
          });
        }
      },
    },
  },
});
