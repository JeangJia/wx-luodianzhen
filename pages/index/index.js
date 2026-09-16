// pages/index/index.js
const { spots } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')
const { toTagList } = require('../../utils/tagTone')

const app = getApp()

// 景点分类 → 卡片左上角徽章用的线性图标
const CAT_ICON = {
  '古镇人文': 'cat-heritage',
  '非遗民俗': 'cat-folk',
  '田园农趣': 'cat-farm',
  '园林休闲': 'cat-garden'
}

// 轮播：theme 对应 app.wxss 中的 .ph-1 ~ .ph-6
// 1 龙船红 · 2 生态绿 · 3 罗店金 · 4 美兰湖蓝 · 5 花神粉 · 6 黛瓦青
const banners = [
  {
    id: 'b1',
    type: 'spot',
    targetId: 's1',
    cover: '/images/scenic/罗店古镇老街.jpg',
    theme: 6,
    title: '金罗店 · 江南古镇',
    subtitle: '元代罗升开店成集，练祁河畔“三湾九街十八弄”'
  },
  {
    id: 'b2',
    type: 'spot',
    targetId: 's5',
    cover: '/images/scenic/罗店龙船文化展示馆.jpg',
    theme: 1,
    title: '夏有龙船 · 冬有灯彩',
    subtitle: '400 余年端午龙船与竹骨彩灯，一门会发光的非遗'
  },
  {
    id: 'b3',
    type: 'spot',
    targetId: 's7',
    cover: '/images/scenic/罗店花神堂.jpg',
    theme: 5,
    title: '春有花神 · 花神故里',
    subtitle: '农历二月十二花神庙会，2017 年恢复的春日民俗盛会'
  },
  {
    id: 'b4',
    type: 'spot',
    targetId: 's8',
    cover: '/images/scenic/远景村千亩花田.jpg',
    theme: 2,
    title: '千亩花田 · 郊野罗店',
    subtitle: '油菜花与向日葵轮番盛开，花海小火车开进春天'
  },
  {
    id: 'b5',
    type: 'product',
    targetId: 'p1',
    cover: '/images/goods/天花玉露霜.jpg',
    theme: 3,
    title: '罗店好物 · 产地直供',
    subtitle: '天花玉露霜、罗店鱼圆、千亩稻田新米，下单送到家'
  }
]

/**
 * 快捷入口：一行 5 个，共两行
 * 注意：spot/list、product/list 是 tabBar 页面，wx.switchTab 不能带 url 参数，
 * 所以筛选条件通过 globalData 传递，由目标页 onShow 读取后清空。
 */
const entries = [
  { key: 'spot', icon: 'sight', name: '探景', path: '/pages/spot/list', tab: true },
  { key: 'food', icon: 'food', name: '寻味', path: '/pages/product/list', tab: true, filterKey: 'pendingProductCategory', filter: '水产熟食' },
  { key: 'stay', icon: 'stay', name: '宿栖', path: '/pages/spot/detail?id=s11' },
  { key: 'gift', icon: 'gift', name: '礼遇', path: '/pages/product/list', tab: true, filterKey: 'pendingProductCategory', filter: '非遗糕点' },
  { key: 'boat', icon: 'boat', name: '龙船', path: '/pages/spot/detail?id=s5' },
  { key: 'lantern', icon: 'lantern', name: '彩灯', path: '/pages/spot/detail?id=s6' },
  { key: 'flower', icon: 'flower', name: '花神', path: '/pages/spot/detail?id=s7' },
  { key: 'farm', icon: 'farm', name: '农趣', path: '/pages/spot/list', tab: true, filterKey: 'pendingSpotCategory', filter: '田园农趣' }
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

// 热门景点：滑到尾部空白区后再继续左滑，就进景点列表
const HOT_RESIST = 0.5    // 阻尼：手指走 2px，内容才跟 1px
const HOT_PULL = 45       // 拉伸到该值松手即触发（对应手指约 90px）
const HOT_MAX = 130       // 最大拉伸距离（px）
const HOT_LOADING = 700   // loading 过渡时长（ms）

Page({
  data: {
    banners,
    entries,
    notices,
    hotSpots: [],
    hotRoutes: [],
    hotProducts: [],
    stats: { spot: 0, route: 0, product: 0 },
    cartCount: 0,
    // 热门景点“继续左滑”的橡皮筋与 loading 过渡
    hotPull: 0,
    hotTailOpacity: 1,
    hotAwake: false,
    hotLoading: false
  },

  onLoad() {
    // 热门景点：按评分取前 6 个，并预先截取前 3 条特色（避免 WXML 里嵌套 wx:for + wx:if）
    const hotSpots = spots
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(spot => Object.assign({}, spot, {
        features: (spot.highlights || []).slice(0, 3),
        catIcon: CAT_ICON[spot.category] || 'cat-heritage'
      }))
    // 精选路线：预先算好每个标签的配色 tone，WXML 里直接绑定 class
    const hotRoutes = routes.slice(0, 2).map(route => Object.assign({}, route, {
      tagList: toTagList(route.tags)
    }))
    this.setData({
      hotSpots,
      hotRoutes,
      hotProducts: products.slice(0, 4),
      stats: { spot: spots.length, route: routes.length, product: products.length }
    })
  },

  onShow() {
    this.setData({ cartCount: app.refreshCart() })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    // 从景点列表返回时，收起 loading 层
    this.clearHotLoading()
  },

  onHide() {
    // 切走时收起 loading 层，避免下次回来还盖着
    this.clearHotLoading()
  },

  onPullDownRefresh() {
    this.clearHotLoading()
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /* ---------- 热门景点：滑到最右端继续向左滑 → 跳转景点列表 ---------- */

  onReady() {
    // 量一次容器宽度，用于判断内容是否真的可滑（内容不够宽时不启用这个手势）
    wx.createSelectorQuery()
      .select('.hscroll')
      .boundingClientRect()
      .exec(res => {
        if (res[0]) this.hotViewWidth = res[0].width
      })
  },

  // 滚动过程中往回滑，就取消“已在末尾”的状态
  onHotScroll(e) {
    if (e.detail.deltaX >= 0) return
    this.hotAtEnd = false
    if (this.data.hotAwake) this.setData({ hotAwake: false })
  },

  // 滑到最右端：尾部空白区露出来，箭头开始跳动
  onHotReachEnd(e) {
    // 内容没有超出容器宽度时不存在“继续滑”的动作，不启用
    if (this.hotViewWidth && e.detail.scrollWidth <= this.hotViewWidth + 20) return
    this.hotAtEnd = true
    if (!this.data.hotAwake) this.setData({ hotAwake: true })
  },

  onHotTouchStart(e) {
    this.hotStartX = e.touches[0].clientX
    // 手指按下时尾部空白区已经露出来了，说明这一次滑动就是“再滑一下”
    this.hotFromEnd = !!this.hotAtEnd
  },

  // 跟手橡皮筋：手指走 2px 内容才走 1px，同时把提示“吸”淡
  onHotTouchMove(e) {
    if (!this.hotFromEnd || this.data.hotLoading) return
    const dx = this.hotStartX - e.touches[0].clientX
    if (dx <= 0) {
      // 手指回滑，直接弹回去
      if (this.data.hotPull) this.releaseHotPull()
      return
    }
    const pull = Math.min(dx * HOT_RESIST, HOT_MAX)
    // 位移太小就别重渲染了
    if (Math.abs(pull - this.data.hotPull) < 1.2) return
    this.setData({
      hotPull: pull,
      hotTailOpacity: Math.max(0, 1 - pull / (HOT_PULL * 2))
    })
  },

  onHotTouchEnd(e) {
    if (!this.hotFromEnd) return
    this.hotFromEnd = false
    const moved = this.hotStartX - e.changedTouches[0].clientX
    // 拉够就进；兜底用手指位移判定，个别机型不上报 touchmove 也不会失效
    if (this.data.hotPull >= HOT_PULL || moved > HOT_PULL / HOT_RESIST) {
      this.enterSpotList()
      return
    }
    this.releaseHotPull()
  },

  onHotTouchCancel() {
    this.hotFromEnd = false
    this.releaseHotPull()
  },

  // 没拉够，松手弹回原位（.hscroll-inner 的过渡自带过冲，所以是“弹”回去）
  releaseHotPull() {
    if (!this.data.hotPull && this.data.hotTailOpacity === 1) return
    this.setData({ hotPull: 0, hotTailOpacity: 1 })
  },

  // 走一段 loading 过渡再跳，避免页面瞬间切换
  enterSpotList() {
    if (this.data.hotLoading) return
    this.setData({
      hotLoading: true,
      hotPull: HOT_MAX,   // 顺着惯性再推一段，像被吸出去
      hotTailOpacity: 0
    })
    this.hotTimer = setTimeout(() => {
      wx.switchTab({
        url: '/pages/spot/list',
        // 万一没跳成功，把 loading 收回来，别把页面卡住
        fail: () => this.clearHotLoading()
      })
    }, HOT_LOADING)
  },

  // 收起 loading 层并复位橡皮筋（切走 / 返回 / 下拉刷新都要清）
  clearHotLoading() {
    if (this.hotTimer) {
      clearTimeout(this.hotTimer)
      this.hotTimer = null
    }
    if (!this.data.hotLoading && !this.data.hotPull) return
    this.setData({ hotLoading: false, hotPull: 0, hotTailOpacity: 1 })
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

    if (entry.filterKey) {
      app.globalData[entry.filterKey] = entry.filter
    }
    if (entry.tab) {
      wx.switchTab({ url: entry.path })
    } else {
      wx.navigateTo({ url: entry.path })
    }
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
