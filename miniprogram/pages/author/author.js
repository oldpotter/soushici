const limit = 20;
Page({
  data: {
    author: null,
    type: '',
    fontSize: '',
    list: [],
    loading: false,
    collecting: false,
    collected: false
  },

  onLoad(e) {
    this.setData({
      author: JSON.parse(e.item),
      fontSize: getApp().globalData.fontSize,
      type: (JSON.parse(e.item).desc ? 'shi' : 'ci') + '_author'
    })
    // console.log(this.data.type)
    const db = getApp().globalData.db
    const _this = this
    this.setData({
      loading: true
    })

    //查询是否已经收藏这个作者
    this._isCollected(this.data.author._id).then(res => {
        _this.setData({
          collected: res.data.length > 0 ? true : false
        })
        return new Promise((resolve, reject) => { //转简体
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
      })
      .then(author => { //搜索词
        return new Promise((resolve, reject) => {
          db.collection('ci').limit(limit).where({
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
      .then(author => { //搜索诗
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
  },

  tapCollect(e) {
    const db = getApp().globalData.db
    const _this = this
    this.setData({
      collecting: true
    })
    this._isCollected(this.data.author._id).then(res => {
      if (res.data.length > 0) {
        //取消收藏
        db.collection('collect').doc(res.data[0]._id).remove({
          success(res) {
            _this.setData({
              collected: false,
              collecting: false
            })
          }
        })
      } else {
        //收藏
        db.collection('collect').add({
          data: {
            type: _this.data.type,
            id: _this.data.author._id
          },
          success(res) {
            _this.setData({
              collected: true,
              collecting: false
            })
          }
        })
      }
    })
  },

  _isCollected(id) { //是否已经收藏这个作画
    const db = getApp().globalData.db
    return new Promise((resolve, reject) => {
      db.collection('collect').where({
        id
      }).get({
        success(res) {
          resolve(res)
        }
      })
    })
  }
})