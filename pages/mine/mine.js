// pages/mine/mine.js
const order = require('../../utils/order')
const cart = require('../../utils/cart')
const travel = require('../../utils/travel')
const { spots } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')

// 图标由 .order-ico--{key} 提供，不在这里放 emoji
const ORDER_ENTRIES = [
  { key: 'unpaid', name: '待付款' },
  { key: 'paid', name: '待收货' },
  { key: 'done', name: '已完成' },
  { key: 'all', name: '全部订单' }
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

  // 出行指南（与 utils/travel.js 共用一份文案）
  goTravel() {
    travel.showTravelGuide()
  },

  callService() {
    // 演示号码，上线前请替换为真实服务电话
    wx.makePhoneCall({ phoneNumber: '02156860000' })
  },

  showAbout() {
    wx.showModal({
      title: '罗店镇印象',
      content:
        '罗店镇隶属上海市宝山区，位于宝山区西北部，地处宝山、嘉定与江苏太仓三地交界处，' +
        '区域面积约 44.19 平方公里，是上海的北大门。\n\n' +
        '镇名相传源自元代商人罗升在此开店设旅舍、渐成集市，因而又称“罗溪”。' +
        '明代罗店已是嘉定县七镇五市之首，是重要的棉花与棉布集散地，' +
        '“金罗店、银南翔、铜江湾、铁大场”之说中位列首位。\n\n' +
        '如今罗店形成“美兰湖、创新药、古镇韵、乡村风”的发展格局，' +
        '文化上以“春有花神秋有画，夏有龙船冬有灯”的四季品牌著称：' +
        '端午划龙船习俗已有 400 余年，2008 年入选国家级非物质文化遗产；' +
        '罗店彩灯是上海市非物质文化遗产；花神节自 2017 年恢复。\n\n' +
        '「游罗店」提供古镇景点导览、精品路线推荐与本地农产品选购，' +
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
