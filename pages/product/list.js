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
    total: products.length
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

  onCategoryTap(e) {
    this.setData({ active: e.currentTarget.dataset.key }, () => this.filter())
  },

  onSortTap(e) {
    this.setData({ sort: e.currentTarget.dataset.key }, () => this.filter())
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
