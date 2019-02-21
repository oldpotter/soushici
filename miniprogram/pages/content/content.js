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
    // console.log(this.data.item)
    const _this = this
    const db = getApp().globalData.db

    new Promise((resolve, reject) => {
        wx.cloud.callFunction({ //简体
          name: 'simplebig',
          data: {
            type: 't2s',
            str: _this.data.item.author
          },
          success(res) {
            resolve(res.result)
          }
        })
      })
      .then(author => {
        return new Promise((resolve, reject) => {
          db.collection('ci_author').where({
              name: author
            })
            .get({
              success(res) {
                resolve(res.data[0])
								// console.log(res)
              }
            })
        })
      })
      .then(author => {
        _this.setData({
          author
        })
        return new Promise((resolve, reject) => {
          wx.cloud.callFunction({ //转繁体
            name: 'simplebig',
            data: {
              type: 's2t',
              str: _this.data.item.author
            },
            success(res) {
              resolve(res.result)
            }
          })
        })
      })
      .then(author => {
        return new Promise((resolve, reject) => {
          db.collection('shi_author').where({
              name: author
            })
            .get({
              success(res) {
                resolve(res.data[0])
              }
            })
        })
      })
			.then(author=>{
				_this.setData({
					author,
					loading: false
				})
			})

  }
})