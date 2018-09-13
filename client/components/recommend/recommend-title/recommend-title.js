Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    needSwitch: {
      type: Boolean,
      value: true,
    },
    showMore: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    switchRecommenList: function() {
      this.triggerEvent('switchList');
    },
  },
});
