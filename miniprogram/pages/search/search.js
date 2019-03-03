const limit = 20;
const Promise = require('../../utils/bluebird.min.js')
Page({
  data: {
    list: []
  },

	onLoad(){
		Promise.config({
			// Enable cancellation
			cancellation: true
		})
	},

  doSearch(e) {
		if (this.p) this.p.cancel()
    const _this = this
    let keyword = e.detail.value.trim()
    if (keyword.length == 0) {
      return
    }
    wx.showLoading({
      mask: false,
    })
    //搜索'shi'、'ci'、'author'
    const db = getApp().globalData.db
    const _ = db.command
    this.p =  new Promise((resolve, reject) => {
        wx.cloud.callFunction({ //转简体
          name: 'simplebig',
          data: {
            type: 't2s',
            str: keyword
          },
          success(res) {
            resolve(res.result)
          }
        })
      })
      .then(res => {
        keyword = res
        // console.log('keyword:', res)
        return new Promise((resolve, reject) => {
          db.collection('ci_author').limit(limit).where(_.or({
              name: {
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
                // console.log('ci_author:', res.data)
              },
              fail(err) {
                reject(err)
              },
            })
        })
      })
      .then(res => {
        _this.setData({
          list: res.data
        })

        return new Promise((resolve, reject) => {
          db.collection('ci').limit(limit).where(_.or({
              author: {
                $regex: '.*' + keyword
              },
              paragraphs: {
                $regex: '.*' + keyword
              },
              rhythmic: {
                $regex: '.*' + keyword
              }
            }))
            .get({
              success(res) {
                resolve(res)
                // console.log('ci:', res.data)
              },
              fail(err) {
                reject(err)
              },
            })
        })
      })
      .then(res => {
        let list = _this.data.list
        list = list.concat(res.data)
        _this.setData({
          list
        })
        //转繁体
        return new Promise((resolve, reject) => {
          wx.cloud.callFunction({ //转繁体
            name: 'simplebig',
            data: {
              type: 's2t',
              str: keyword
            },
            success(res) {
              resolve(res.result)
            }
          })
        })
      })
      .then(res => {
        keyword = res //搜索诗作者
        // console.log('keyword:', res)
        return new Promise((resolve, reject) => {
          db.collection('shi_author').limit(limit).where(_.or({
              name: {
                $regex: '.*' + keyword
              }
            }, {
              desc: {
                $regex: '.*' + keyword
              }
            }))
            .get({
              success(res) {
                resolve(res)
                // console.log('shi_author:', res.data)
              },
              fail(err) {
                reject(err)
              },
            })
        })
      })
      .then(res => {
        let list = _this.data.list
        list = list.concat(res.data)
        _this.setData({
          list
        })
        //搜索诗
        return new Promise((resolve, reject) => {
          db.collection('shi').limit(limit).where(_.or({
              title: {
                $regex: '.*' + keyword
              }
            }, {
              paragraphs: {
                $regex: '.*' + keyword
              }
            }, {
              author: {
                $regex: '.*' + keyword
              }
            }))
            .get({
              success(res) {
                resolve(res)
                // console.log('shi:', res.data)
              },
              fail(err) {
                reject(err)
              },
            })

        })
      })
      .then(res => {
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
            success() {
              resolve()
            }
          })
        })
      })
      .then(res => {
        wx.hideLoading()
      })

  }
})