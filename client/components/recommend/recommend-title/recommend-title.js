Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    bookId: {
      type: Number,
      value: 0,
    },
    needSwitch: {
      type: Boolean,
      value: true,
    },
    showMore: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    switchRecommenList: function() {
      this.triggerEvent('switchList');
    },
  },
});
