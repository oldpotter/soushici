Page({
	data: {
		author: null,
		fontSize: ''
	},

	onLoad(e){
		this.setData({
			author: JSON.parse(e.item),
			fontSize: getApp().globalData.fontSize
		})
	}
})