// app.js
const cart = require('./utils/cart')

App({
  onLaunch() {
    // 预留：接入后端后，用 code 换取 openId / sessionKey
    // wx.login({ success: res => console.log('login code', res.code) })
    this.globalData.cartCount = cart.count()
  },

  globalData: {
    userInfo: null,
    cartCount: 0,
    // tabBar 页面无法通过 url 传参，用它暂存首页快捷入口带来的筛选条件
    pendingSpotCategory: '',
    pendingProductCategory: '',
    // 服务端地址，接入真实接口后修改
    apiBase: 'https://example.com/api'
  },

  // 刷新购物车角标数量
  refreshCart() {
    this.globalData.cartCount = cart.count()
    return this.globalData.cartCount
  }
})
