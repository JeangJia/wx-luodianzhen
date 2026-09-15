// pages/mine/mine.js
const order = require('../../utils/order')
const cart = require('../../utils/cart')
const { spots } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')

const ORDER_ENTRIES = [
  { key: 'unpaid', icon: '💰', name: '待付款' },
  { key: 'paid', icon: '📦', name: '待收货' },
  { key: 'done', icon: '✅', name: '已完成' },
  { key: 'all', icon: '📋', name: '全部订单' }
]

Page({
  data: {
    orderEntries: ORDER_ENTRIES,
    avatarUrl: '',
    nickName: '',
    counts: { unpaid: 0, paid: 0, done: 0, all: 0 },
    cartCount: 0,
    stats: { spot: 0, route: 0, product: 0 }
  },

  onLoad() {
    this.setData({
      stats: { spot: spots.length, route: routes.length, product: products.length }
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
    const user = wx.getStorageSync('ldz_user') || {}
    const orders = order.getOrders()
    this.setData({
      avatarUrl: user.avatarUrl || '',
      nickName: user.nickName || '',
      cartCount: cart.count(),
      counts: {
        all: orders.length,
        unpaid: orders.filter(item => item.status === 'unpaid').length,
        paid: orders.filter(item => item.status === 'paid').length,
        done: orders.filter(item => item.status === 'done').length
      }
    })
  },

  saveUser(patch) {
    const user = Object.assign({}, wx.getStorageSync('ldz_user') || {}, patch)
    wx.setStorageSync('ldz_user', user)
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    this.saveUser({ avatarUrl })
    this.setData({ avatarUrl })
  },

  onNickChange(e) {
    const nickName = (e.detail.value || '').trim()
    this.saveUser({ nickName })
    this.setData({ nickName })
  },

  goOrders(e) {
    const status = e.currentTarget.dataset.status || 'all'
    wx.navigateTo({ url: '/pages/order/list?status=' + status })
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  goSpotList() {
    wx.switchTab({ url: '/pages/spot/list' })
  },

  goProductList() {
    wx.switchTab({ url: '/pages/product/list' })
  },

  callService() {
    // 演示号码，上线前请替换为真实服务电话
    wx.makePhoneCall({ phoneNumber: '02156860000' })
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content:
        '「游罗店」面向上海市宝山区罗店镇，提供古镇景点导览、精品路线推荐与本地农产品选购。\n\n' +
        '罗店旧称“金罗店”，古镇已有 700 余年历史，以端午龙船与罗店彩灯两项非遗闻名，' +
        '并有千亩农田、美兰湖小镇与练祁河上的古桥。\n\n' +
        '景点开放时间、活动安排与产品信息请以官方发布为准。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  showGuide() {
    wx.showModal({
      title: '使用说明',
      content: '1. 在「景点」查看镇域及周边景点介绍；\n2. 在「路线」查看精品线路，或用「智能规划」生成行程；\n3. 在「农产品」选购本地特产，支持线上下单；\n4. 在「我的」查看订单与收货信息。',
      showCancel: false
    })
  },

  onShareAppMessage() {
    return { title: '游罗店 · 罗店镇文旅导览与农产品直供', path: '/pages/index/index' }
  }
})
