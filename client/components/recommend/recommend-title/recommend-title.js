
Component({
  properties: {
    title: {
      type: String,
      value: ''
    }
  },
  methods: {
    switchRecommenList: function() {
      this.triggerEvent('switchList')
    }
  }
})
