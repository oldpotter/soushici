const limit = 5;
Page({
  data: {
    list: []
  },

  doSearch(e) {
    const _this = this
    const keyword = e.detail.value.trim()
    if (keyword.length == 0) {
      return
    }
    wx.showLoading({
      mask: false,
    })
    //搜索'shi'、'ci'、'author'
    const db = getApp().globalData.db
    const _ = db.command

    new Promise((resolve, reject) => {
        db.collection('author').limit(limit).where(_.or({
            name: {
              $regex: '.*' + keyword
            }
          }, {
            desc: {
              $regex: '.*' + keyword
            }
          }, {
            description: {
              $regex: '.*' + keyword
            }
          }))
          .get({
            success(res) {
              resolve(res)
            },
            fail(err) {
              reject(err)
            },
          })
      })
      .then(res => {
        // console.log('搜索author:')
        // console.log(res)
        _this.setData({
          list: res.data
        })
        return new Promise((resolve, reject) => {
					db.collection('shi').limit(limit).where(_.or({
              title: {
                $regex: '.*' + keyword
              }
            }, {
              paragraphs: {
                $regex: '.*' + keyword
              }
            }))
            .get({
              success(res) {
                resolve(res)
              },
              fail(err) {
                reject(err)
              },
            })
        })
      })
      .then(res => {
        // console.log('搜索shi:')
        // console.log(res)
        let list = _this.data.list
        list = list.concat(res.data)
        _this.setData({
          list
        })
        return new Promise((resolve, reject) => {
					db.collection('ci').limit(limit).where(_.or({
              rhythmic: {
                $regex: '.*' + keyword
              }
            }, {
              paragraphs: {
                $regex: '.*' + keyword
              }
            }))
            .get({
              success(res) {
                resolve(res)
              },
              fail(err) {
                reject(err)
              },
            })
        })
      })
      .then(res => {
        // console.log('搜索ci:')
        // console.log(res)
        let list = _this.data.list
        list = list.concat(res.data)
        _this.setData({
          list
        })
        return new Promise((resolve, reject) => {
          db.collection('logs').add({
            data: {
              keyword,
              date: db.serverDate()
            },
						success(){
							resolve()
						}
          })
        })
      })
      .then(() => {
        wx.hideLoading()
      })

  }
})