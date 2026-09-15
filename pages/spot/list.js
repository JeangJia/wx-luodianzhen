// pages/spot/list.js
const { spots, categories } = require('../../data/spots')

const app = getApp()

Page({
  data: {
    categories,
    active: 'all',
    keyword: '',
    list: [],
    total: spots.length
  },

  onLoad() {
    this.filter()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    // 处理首页快捷入口带来的分类筛选
    const pending = app.globalData.pendingSpotCategory
    if (pending) {
      app.globalData.pendingSpotCategory = ''
      this.setData({ active: pending, keyword: '' }, () => this.filter())
    }
  },

  onCategoryTap(e) {
    this.setData({ active: e.currentTarget.dataset.key }, () => this.filter())
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.filter())
  },

  clearKeyword() {
    this.setData({ keyword: '' }, () => this.filter())
  },

  filter() {
    const { active, keyword } = this.data
    const kw = keyword.trim()
    const list = spots.filter(item => {
      const matchCategory = active === 'all' || item.category === active
      const matchKeyword = !kw ||
        item.name.indexOf(kw) > -1 ||
        item.town.indexOf(kw) > -1 ||
        item.tags.join('').indexOf(kw) > -1
      return matchCategory && matchKeyword
    })
    this.setData({ list })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  onShareAppMessage() {
    return { title: '罗店镇景点导览 · 游罗店', path: '/pages/spot/list' }
  }
})
