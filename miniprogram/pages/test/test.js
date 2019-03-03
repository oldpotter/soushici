const Promise = require('../../utils/bluebird.min.js')
Page({
	onLoad(){
		Promise.config({
			// Enable cancellation
			cancellation: true
		})
	},

	click(){
		if(this.p) this.p.cancel()
		this.p = this.test()
		this.p.then(res=>console.log(res))
	},

	test(){
		return new Promise((resolve, reject) => {
			this.time = setTimeout(() => {
				resolve('haha')
			}, 2000)
		})
	}
})