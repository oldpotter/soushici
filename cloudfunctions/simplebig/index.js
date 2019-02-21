// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  S = require("simplebig")
  if (event.type == 's2t') { //简体转繁体
    return S.s2t(event.str)
  } else if (event.type == 't2s') { //繁体转简体
    return S.t2s(event.str)
  }
}