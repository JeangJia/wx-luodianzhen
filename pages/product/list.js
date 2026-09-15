// pages/product/list.js
const { products, categories } = require('../../data/products')
const cart = require('../../utils/cart')

const app = getApp()

const sorts = [
  { key: 'default', name: '综合' },
  { key: 'sales', name: '销量' },
  { key: 'priceAsc', name: '价格升序' },
  { key: 'priceDesc', name: '价格降序' }
]

Page({
  data: {
    categories,
    sorts,
    active: 'all',
    sort: 'default',
    keyword: '',
    list: [],
    cartCount: 0,
    total: products.length,
    // 排序栏滑动下划线
    lineWidth: 0,
    lineLeft: 0,
    lineReady: false
  },

  onLoad() {
    this.filter()
  },

  onShow() {
    this.setData({ cartCount: app.refreshCart() })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    // 处理首页快捷入口带来的分类筛选
    const pending = app.globalData.pendingProductCategory
    if (pending) {
      app.globalData.pendingProductCategory = ''
      this.setData({ active: pending, keyword: '' }, () => this.filter())
    }
  },

  onReady() {
    this.measureSortTabs()
  },

  onResize() {
    // 屏幕尺寸变化后 tab 位置会变，重新测一次
    this.measureSortTabs()
  },

  /**
   * 滑动下划线要和文字同宽，写死宽度不行（每个 tab 字数不同），
   * 所以用 boundingClientRect 实测每个 tab 的 left / width，
   * 再换算成相对 .sort-bar 的偏移
   */
  measureSortTabs() {
    wx.createSelectorQuery()
      .selectAll('.sort')
      .boundingClientRect()
      .select('.sort-bar')
      .boundingClientRect()
      .exec(res => {
        const tabs = res[0]
        const bar = res[1]
        if (!tabs || !tabs.length || !bar) return
        this.sortTabs = tabs
        this.sortBarLeft = bar.left
        this.moveSortLine()
      })
  },

  moveSortLine() {
    const tabs = this.sortTabs
    if (!tabs) return
    const index = Math.max(0, this.data.sorts.findIndex(item => item.key === this.data.sort))
    const rect = tabs[index]
    if (!rect) return
    this.setData({
      lineWidth: rect.width,
      lineLeft: rect.left - this.sortBarLeft
    }, () => {
      // 首次定位不参与过渡，否则下划线会从左侧"长"出来
      if (!this.lineReady) {
        this.lineReady = true
        setTimeout(() => this.setData({ lineReady: true }), 60)
      }
    })
  },

  onCategoryTap(e) {
    this.setData({ active: e.currentTarget.dataset.key }, () => this.filter())
  },

  onSortTap(e) {
    const key = e.currentTarget.dataset.key
    if (key === this.data.sort) return
    this.setData({ sort: key }, () => {
      this.filter()
      this.moveSortLine()
    })
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.filter())
  },

  filter() {
    const { active, sort, keyword } = this.data
    const kw = keyword.trim()
    let list = products.filter(item => {
      const matchCategory = active === 'all' || item.category === active
      const matchKeyword = !kw ||
        item.name.indexOf(kw) > -1 ||
        item.origin.indexOf(kw) > -1 ||
        item.tags.join('').indexOf(kw) > -1
      return matchCategory && matchKeyword
    })

    if (sort === 'sales') list = list.slice().sort((a, b) => b.sales - a.sales)
    if (sort === 'priceAsc') list = list.slice().sort((a, b) => a.price - b.price)
    if (sort === 'priceDesc') list = list.slice().sort((a, b) => b.price - a.price)

    this.setData({ list })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' })
  },

  addToCart(e) {
    const product = products.find(item => item.id === e.currentTarget.dataset.id)
    if (!product) return
    cart.add(product, product.specs[0], 1)
    this.setData({ cartCount: app.refreshCart() })
    wx.showToast({ title: '已加入购物车', icon: 'none' })
  },

  onShareAppMessage() {
    return { title: '罗店镇农产品商城 · 产地直供', path: '/pages/product/list' }
  }
})
