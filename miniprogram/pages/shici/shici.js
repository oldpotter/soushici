const limit = 10
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
    if (e.detail.key == 'sc' || e.detail.key == 'rm') {
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
			setTimeout(()=>{
				wx.hideToast()
				_this.tapTab({detail:{key: 'shi'}})
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
              resolve(res.data)
            },
          })
      } else {
        db.collection(collection)
          .limit(limit)
          .get({
            success(res) {
              resolve(res.data)
            },
          })
      }

    })

  }
})