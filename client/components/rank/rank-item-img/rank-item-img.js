Component({
  properties: {
    mode: {
      type: String,
      value: 'aspectFill',
    },
    item: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
    // 如果image的mode不是widthFix，则需要传递height来控制image的高度
    height: {
      type: Number,
      value: 200,
    }
  },
});
