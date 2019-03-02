Page({
  data: {
    item: null,
    fontSize: '',
    author: null,
    collecting: false,
    collected: false,
		type: ''
  },

  onLoad(e) {
    this.setData({
      item: JSON.parse(e.item),
      fontSize: getApp().globalData.fontSize,
			type: JSON.parse(e.item).rhythmic ? 'ci' : 'shi'
    })
    // console.log(this.data.type)
    const _this = this
    const db = getApp().globalData.db
    //查询是否已经收藏
    this._isCollected(this.data.item._id).then(res => {
        _this.setData({
          collected: res.data.length > 0 ? true : false
        })

        return new Promise((resolve, reject) => {
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
      .then(author => {
        _this.setData({
          author,
          loading: false
        })
      })

  },

  tapCopy() { //复制内容
    let data = ''
    this.data.item.paragraphs.forEach((item, idx) => {
      data = data + (idx == 0 ? '' : '\n') + item
      // console.log(`idx:${idx}, item:${item}`)
    })
    wx.setClipboardData({
      data
    })
  },
	tapCollect(e) {
		const db = getApp().globalData.db
		const _this = this
		this.setData({
			collecting: true
		})
		this._isCollected(this.data.item._id).then(res => {
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
						id: _this.data.item._id
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