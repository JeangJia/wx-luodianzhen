// pages/spot/list.js
const { spots, categories } = require('../../data/spots')

const app = getApp()

Page({
  data: {
    categories,
    active: 'all',
    keyword: '',
    list: [],
    total: spots.length,
    // 底部规划条的入场动画名（bar-a / bar-b 交替，用来重复触发同一个动画）
    barAnim: 'bar-a'
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
    this.playBarIn()
  },

  /**
   * 底部规划条从 tabBar 背后整条升上来。
   * 首次进入靠 data 里的 bar-a 在渲染时自动播；之后再进页面得换成 bar-b ——
   * 同一个动画名不会重复触发，换名才会重新开始。
   * 首次不能也换：那样会和渲染时的动画撞上，升到一半又跳回起点重播，看着就是抖
   */
  playBarIn() {
    if (!this.barPlayed) {
      this.barPlayed = true
      return
    }
    this.setData({ barAnim: this.data.barAnim === 'bar-a' ? 'bar-b' : 'bar-a' })
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
