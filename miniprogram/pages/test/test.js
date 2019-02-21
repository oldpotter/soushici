// miniprogram/pages/test/test.js
const moment = require('moment')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let keyword = '谁知盘中餐'
    const db = getApp().globalData.db
    const _ = db.command
    new Promise((resolve, reject) => {
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
      .then(res => {
				keyword = res
        console.log('keyword:', keyword)
        
      })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})