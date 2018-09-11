const LEN = 5;

Component({
  data: {
    starImgList: [],
  },
  properties: {
    score: {
      type: String,
      value: '0.0',
      observer: function(newVal) {
        this._setStarList(newVal);
      },
    },
  },
  methods: {
    // 星级图片列表
    _setStarList: function(score) {
      let result = [];
      const integerFull = Math.floor(score);
      const decimal = Number((score - integerFull).toFixed(1)); // 解决浮点数问题
      let integerEmpty = 0;
      // 满星
      for (let i = 0; i < integerFull; i++) {
        result.push('./ic_comic_detail_star_yellow_full2.png');
      }
      // 半星
      if (decimal > 0 && decimal <= 0.2) {
        result.push('./ic_comic_detail_star_yellow_full20.png');
      } else if (decimal > 0.2 && decimal <= 0.4) {
        result.push('./ic_comic_detail_star_yellow_full40.png');
      } else if (decimal === 0.5) {
        result.push('./ic_comic_detail_star_yellow_full50.png');
      } else if (decimal > 0.5 && decimal <= 0.7) {
        result.push('./ic_comic_detail_star_yellow_full60.png');
      } else if (decimal > 0.7) {
        result.push('./ic_comic_detail_star_yellow_full80.png');
      }
      // 如果 评分小于 LEN - 1 使用空星
      if (decimal === 0 && integerFull <= LEN - 1) {
        integerEmpty = LEN - integerFull;
        for (let i = 0; i < integerEmpty; i++) {
          result.push('./ic_comic_detail_star_yellow_empty2.png');
        }
      }
      this.setData({
        starImgList: result,
      });
    },
  },
});
