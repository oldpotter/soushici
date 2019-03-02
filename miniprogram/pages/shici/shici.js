const limit = 10
const moment = require('moment')
Page({
  data: {
    currentList: '1',
    skip: 0,
    list: [],
    loading: false,
    tip: ''
  },

  onLoad() {
    this.tapTab({
      detail: {
        key: 'shi'
      }
    })
  },

  onShow() {
    this.start = moment()
  },

  onHide() {
    this.duration = moment() - this.start
    const db = getApp().globalData.db
    const _this = this
    db.collection('duration').add({
      data: {
        duration: _this.duration,
        page: 'shici',
        tab: _this.data.currentList
      }
    })
  },

  onReachBottom() {
    const _this = this
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '',
    })
    this.getList(this.data.skip, this.data.currentList).then(res => {
      let list = _this.data.list
      list = list.concat(res)
      _this.setData({
        list,
        loading: false,
        tip: res.length < limit ? '没有更多数据了' : '',
        skip: list.length
      })
      wx.hideLoading()
    })
  },


  tapTab(e) {
    const _this = this
    if (e.detail.key == 'rm') {
      wx.showToast({
        title: '该功能维护中',
        icon: 'fail',
        image: '',
        duration: 50000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      setTimeout(() => {
        wx.hideToast()
        _this.tapTab({
          detail: {
            key: 'shi'
          }
        })
      }, 1000)
      return
    }
    this.setData({
      currentList: e.detail.key
    })
    wx.showLoading({})
    this.getList(0, e.detail.key).then(res => {
      _this.setData({
        list: res,
        skip: res.length,
        tip: res.length > 0 ? '' : '暂时没有数据'
      })
      wx.hideLoading()
    })

  },

  _getCollect(db, collection, id) {
    return new Promise((resolve, reject) => {
      db.collection(collection).doc(id).get({
        success(res) {
          resolve(res.data)
        }
      })
    })
  },

  getList(skip = 0, collection = 'shi') {
    const _this = this
    const db = getApp().globalData.db
    return new Promise((resolve, reject) => {
      if (skip != 0) {
        db.collection(collection)
          .limit(limit)
          .skip(skip)
          .get({
            success(res) {
              if (collection == 'collect') {
								let tasks = []
								res.data.forEach(item => {
									let p = _this._getCollect(db, item.type, item.id)
									tasks.push(p)
								})
								Promise.all(tasks).then(res => {
									resolve(res)
								})
              } else {
                resolve(res.data)
              }
            },
          })
      } else {
        db.collection(collection)
          .limit(limit)
          .get({
            success(res) {
              if (collection == 'collect') {
                let tasks = []
                res.data.forEach(item => {
                  let p = _this._getCollect(db, item.type, item.id)
                  tasks.push(p)
                })
                Promise.all(tasks).then(res => {
                	resolve(res)
                })
              } else {
                resolve(res.data)
              }
            },
          })
      }

    })

  }
})