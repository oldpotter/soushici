Page({
  data: {
    item: null,
    fontSize: '',
    author: null
  },

  onLoad(e) {
    this.setData({
      item: JSON.parse(e.item),
      fontSize: getApp().globalData.fontSize
    })
		console.log(this.data.item)
    const _this = this
    const db = getApp().globalData.db
    db.collection('author').where({
        name: _this.data.item.author
      })
      .get({
        success(res) {
          _this.setData({
            author: res.data[0]
          })
        }
      })
  }
})