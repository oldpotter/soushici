Page({

  onLoad() {
		let tasks = []
		let arr = [1, 2, 3, 4]
		arr.forEach(num=>{
			let p = this.test(1)
			tasks.push(p)
			console.log(tasks)
		})
  },

  test(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
				console.log(num)
				resolve()
			}, num*1000)
    })
  }
})