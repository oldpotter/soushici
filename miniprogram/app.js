//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
				env: 'dev-e8c6ba'//目前统一使用dev后台
      })
    }
		const _this = this
    this.globalData = {
			db: wx.cloud.database(),
			fontSize: 15
		}
		wx.getSystemInfo({
			success(res) {
				_this.globalData.fontSize = res.fontSizeSetting
			}
		})
  }
})
