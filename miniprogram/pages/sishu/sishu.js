const moment = require('moment')
Page({
  data: {
    currentBook: '',
    currentChapter: '',
    chapters: [],
    paragraphs: [],
    fontSize: 10
  },

  onLoad() {
    this.setData({
      fontSize: getApp().globalData.fontSize
    })
    this.tapBook({
      detail: {
        key: 'daxue'
      }
    })
  },

	onShow() {
		this.start = moment()
	},

	onHide() {
		this.uploadDuration()
	},

	uploadDuration(){
		this.duration = moment() - this.start
		this.start = moment()
		const db = getApp().globalData.db
		const _this = this
		db.collection('duration').add({
			data: {
				duration: _this.duration,
				page: 'sishu',
				tab: _this.data.currentBook
			}
		})
	},

  tapBook(e) {
		this.uploadDuration()
    //点击tab
    this.setData({
      currentBook: e.detail.key
    })
    wx.showLoading({
      mask: true,
    })
    const _this = this
    this.getData(e.detail.key).then(chapters => {
      // console.log(chapters)
      _this.setData({
        chapters
      })
      wx.hideLoading()
      _this.tapChapter({
        detail: {
          key: chapters[0]._id
        }
      })
    })
  },

  tapChapter(e) {
    // console.log(e.detail.key)
    const chapter = this.data.chapters.filter(chapter => chapter._id === e.detail.key)[0]
    this.setData({
      currentChapter: e.detail.key,
      paragraphs: chapter.paragraphs ? chapter.paragraphs : chapter.paragrahs
    })
  },

  getData(book = 'daxue') {
    return new Promise((resolve, reject) => {
      const db = getApp().globalData.db
      db.collection('sishu').where({
          book
        })
        .get({
          success(res) {
            // console.log(res.data)	
            resolve(res.data)
          },
          fail(err) {
            reject(err)
          }
        })
    })

  }
})