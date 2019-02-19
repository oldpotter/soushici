const limit = 10;
Page({
  data: {
    author: null,
    fontSize: '',
    list: [],
    loading: false
  },

  onLoad(e) {
    this.setData({
      author: JSON.parse(e.item),
      fontSize: getApp().globalData.fontSize
    })
    const db = getApp().globalData.db
    const _this = this
    this.setData({
      loading: true
    })
    new Promise((resolve, reject) => {
        db.collection('shi').limit(limit).where({
            author: _this.data.author.name
          })
          .get({
            success(res) {
              resolve(res.data)
            }
          })
      })
      .then(res => {
        let list = _this.data.list
        list = list.concat(res)
        _this.setData({
          list
        })
        return new Promise((resolve, reject) => {
          db.collection('ci').limit(limit).where({
              author: _this.data.author.name
            })
            .get({
              success(res) {
                resolve(res.data)
              }
            })
        })
      })
      .then(res => {
        let list = _this.data.list
        list = list.concat(res)
        _this.setData({
          list,
          loading: false
        })
      })
  }
})