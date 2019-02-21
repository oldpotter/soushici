const limit = 20;
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

    new Promise((resolve, reject) => { //转简体
        wx.cloud.callFunction({
          name: 'simplebig',
          data: {
            type: 't2s',
            str: _this.data.author.name
          },
          success(res) {
            resolve(res.result)
          }
        })
      })
      .then(author => {
        return new Promise((resolve, reject) => {
          db.collection('ci').limit(limit).where({
              author:author
            })
            .get({
              success(res) {
								// console.log(`author:${author}`)
								// console.log(res.data)
                resolve(res.data)
              }
            })
        })
      })
      .then(res => {
        let list = _this.data.list
        list = list.concat(res)
        _this.setData({
          list
        })
        return new Promise((resolve, reject) => { //转繁体
          wx.cloud.callFunction({
            name: 'simplebig',
            data: {
              type: 's2t',
              str: _this.data.author.name
            },
            success(res) {
              resolve(res.result)
            }
          })
        })
      })
      .then(author => {
        return new Promise((resolve, reject) => {
          db.collection('shi').limit(limit).where({
              author: author
            })
            .get({
              success(res) {
								// console.log(`author:${author}`)
								// console.log(res.data)
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