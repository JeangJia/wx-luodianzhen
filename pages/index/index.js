// pages/index/index.js
const { spots } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')

const app = getApp()

// 轮播：theme 对应 app.wxss 中的 .ph-1 ~ .ph-6
// 1 龙船红 · 2 生态绿 · 3 罗店金 · 4 美兰湖蓝 · 5 花神粉 · 6 黛瓦青
const banners = [
  {
    id: 'b1',
    type: 'spot',
    targetId: 's1',
    emoji: '🏯',
    theme: 6,
    title: '金罗店 · 江南古镇',
    subtitle: '元代罗升开店成集，练祁河畔“三湾九街十八弄”'
  },
  {
    id: 'b2',
    type: 'spot',
    targetId: 's5',
    emoji: '🐉',
    theme: 1,
    title: '夏有龙船 · 冬有灯彩',
    subtitle: '400 余年端午龙船与竹骨彩灯，一门会发光的非遗'
  },
  {
    id: 'b3',
    type: 'spot',
    targetId: 's7',
    emoji: '🌺',
    theme: 5,
    title: '春有花神 · 花神故里',
    subtitle: '农历二月十二花神庙会，2017 年恢复的春日民俗盛会'
  },
  {
    id: 'b4',
    type: 'spot',
    targetId: 's8',
    emoji: '🌻',
    theme: 2,
    title: '千亩花田 · 郊野罗店',
    subtitle: '油菜花与向日葵轮番盛开，花海小火车开进春天'
  },
  {
    id: 'b5',
    type: 'product',
    targetId: 'p1',
    emoji: '🍡',
    theme: 3,
    title: '罗店好物 · 产地直供',
    subtitle: '天花玉露霜、罗店鱼圆、千亩稻田新米，下单送到家'
  }
]

/**
 * 快捷入口：一行 6 个，共两行
 * 注意：spot/list、product/list 是 tabBar 页面，wx.switchTab 不能带 url 参数，
 * 所以筛选条件通过 globalData 传递，由目标页 onShow 读取后清空。
 */
const entries = [
  { key: 'spot', icon: '🏯', name: '探景', path: '/pages/spot/list', tab: true },
  { key: 'food', icon: '🐟', name: '寻味', path: '/pages/product/list', tab: true, filterKey: 'pendingProductCategory', filter: '水产熟食' },
  { key: 'stay', icon: '⛵', name: '宿栖', path: '/pages/spot/detail?id=s11' },
  { key: 'gift', icon: '🍡', name: '礼遇', path: '/pages/product/list', tab: true, filterKey: 'pendingProductCategory', filter: '非遗糕点' },
  { key: 'leisure', icon: '🎋', name: '休闲', path: '/pages/spot/list', tab: true, filterKey: 'pendingSpotCategory', filter: '园林休闲' },
  { key: 'traffic', icon: '🚇', name: '出行', action: 'traffic' },
  { key: 'impression', icon: '📸', name: '印象', action: 'about' },
  { key: 'culture', icon: '📖', name: '人文', path: '/pages/spot/list', tab: true, filterKey: 'pendingSpotCategory', filter: '古镇人文' },
  { key: 'dragon', icon: '🐉', name: '龙船', path: '/pages/spot/detail?id=s5' },
  { key: 'lantern', icon: '🏮', name: '彩灯', path: '/pages/spot/detail?id=s6' },
  { key: 'flower', icon: '🌺', name: '花神', path: '/pages/spot/detail?id=s7' },
  { key: 'farm', icon: '🌾', name: '农趣', path: '/pages/spot/list', tab: true, filterKey: 'pendingSpotCategory', filter: '田园农趣' }
]

// 实时资讯（上下滚动轮播）
const notices = [
  {
    id: 'n1',
    text: '端午罗店龙船：重观赏轻竞渡，湖面交叉往返如“水上行街”',
    detail: '罗店划龙船习俗可追溯至明代，已有 400 多年历史，2008 年入选国家级非物质文化遗产名录。端午期间有龙船表演，具体时间与观演区域请以官方公告为准；观赏时请听从现场引导、注意水边安全。'
  },
  {
    id: 'n2',
    text: '春节罗店彩灯亮灯，古镇老街与美兰湖同步布展',
    detail: '罗店彩灯是上海市非物质文化遗产，以竹木为骨，融书画、剪纸、编扎于一体。每年春节期间，古镇老街与美兰湖沿线会布置大型主题灯组，是上海市民赏灯的好去处；灯会期间人流量较大，建议错峰前往。'
  },
  {
    id: 'n3',
    text: '农历二月十二花神节：花神故里的春日庙会',
    detail: '罗店素有“花神故里”之称，花神庙会的传统在 2017 年得以恢复。每年农历二月十二前后举办花神节，可逛庙会、看民俗表演、赶春日市集，具体安排以官方公告为准。'
  },
  {
    id: 'n4',
    text: '远景村千亩油菜花田 3-4 月盛花期，花田集市同期开放',
    detail: '远景村是上海市美丽乡村示范村，春季油菜花海、夏季向日葵与荷花接力盛开，园内有花海小火车与露营基地。花期受天气影响，出发前建议先查看官方花讯。'
  },
  {
    id: 'n5',
    text: '罗店好物镇内直供，下单后 48 小时内发货',
    detail: '天花玉露霜、罗店鱼圆、公大酱菜、千亩稻田新米等均为镇内作坊与合作社直供，下单后 48 小时内安排发货；生鲜类商品优先发货，运输破损可申请售后。'
  }
]

Page({
  data: {
    banners,
    entries,
    notices,
    hotSpots: [],
    hotRoutes: [],
    hotProducts: [],
    stats: { spot: 0, route: 0, product: 0 },
    cartCount: 0
  },

  onLoad() {
    // 热门景点：按评分取前 6 个，并预先截取前 3 条特色（避免 WXML 里嵌套 wx:for + wx:if）
    const hotSpots = spots
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(spot => Object.assign({}, spot, {
        features: (spot.highlights || []).slice(0, 3)
      }))
    this.setData({
      hotSpots,
      hotRoutes: routes.slice(0, 2),
      hotProducts: products.slice(0, 4),
      stats: { spot: spots.length, route: routes.length, product: products.length }
    })
  },

  onShow() {
    this.setData({ cartCount: app.refreshCart() })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  onBannerTap(e) {
    const { type, id } = e.currentTarget.dataset
    if (type === 'spot') {
      wx.navigateTo({ url: '/pages/spot/detail?id=' + id })
    } else if (type === 'route') {
      wx.navigateTo({ url: '/pages/route/detail?id=' + id })
    } else {
      wx.navigateTo({ url: '/pages/product/detail?id=' + id })
    }
  },

  onEntryTap(e) {
    const key = e.currentTarget.dataset.key
    const entry = entries.find(item => item.key === key)
    if (!entry) return

    if (entry.action === 'traffic') {
      this.showTraffic()
      return
    }
    if (entry.action === 'about') {
      this.showAbout()
      return
    }

    if (entry.filterKey) {
      app.globalData[entry.filterKey] = entry.filter
    }
    if (entry.tab) {
      wx.switchTab({ url: entry.path })
    } else {
      wx.navigateTo({ url: entry.path })
    }
  },

  // 出行指南 + 一键导航
  showTraffic() {
    wx.showModal({
      title: '出行指南',
      content:
        '罗店镇位于上海市宝山区西北部，地处宝山、嘉定与江苏太仓交界处，是上海的北大门。\n' +
        '地铁：乘 7 号线至美兰湖站，出站步行或换乘公交前往古镇。\n' +
        '公交：840 路、841 路、宝山 16 路、宝山 93 路等可达镇区。\n' +
        '自驾：导航至「罗店古镇」，经沪太路、月罗公路进入镇区。\n' +
        '提示：古镇老街路段较窄、车位有限，节假日建议公共交通前往。',
      confirmText: '打开导航',
      cancelText: '知道了',
      success: res => {
        if (res.confirm) {
          wx.openLocation({
            latitude: 31.4091,
            longitude: 121.3502,
            name: '罗店古镇',
            address: '上海市宝山区罗店镇亭前街、塘西街一带',
            scale: 14
          })
        }
      }
    })
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
        '走进罗店，可走一走练祁河上的大通桥、丰德桥，' +
        '逛一逛古镇老街与宝山寺，再到美兰湖吹吹湖风。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 点击某条资讯
  onNoticeTap(e) {
    const item = notices.find(n => n.id === e.currentTarget.dataset.id)
    if (!item) return
    wx.showModal({
      title: '实时资讯',
      content: item.detail,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 查看全部资讯
  onNoticeMore() {
    const content = notices.map((n, i) => `${i + 1}. ${n.text}`).join('\n\n')
    wx.showModal({
      title: '资讯列表',
      content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' })
  },

  goSpotList() {
    wx.switchTab({ url: '/pages/spot/list' })
  },

  goRouteList() {
    wx.switchTab({ url: '/pages/route/list' })
  },

  goProductList() {
    wx.switchTab({ url: '/pages/product/list' })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  goSpotDetail(e) {
    wx.navigateTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  goRouteDetail(e) {
    wx.navigateTo({ url: '/pages/route/detail?id=' + e.currentTarget.dataset.id })
  },

  goProductDetail(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  onShareAppMessage() {
    return {
      title: '游罗店 · 罗店镇文旅导览与农产品直供',
      path: '/pages/index/index'
    }
  }
})
