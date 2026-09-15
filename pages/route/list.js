// pages/route/list.js
const { routes } = require('../../data/routes')

const filters = [
  { key: 'all', name: '全部' },
  { key: '1', name: '一日游' },
  { key: '2', name: '二日游' },
  { key: 'heritage', name: '非遗民俗' },
  { key: 'family', name: '亲子农趣' }
]

Page({
  data: {
    filters,
    active: 'all',
    list: routes
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onFilterTap(e) {
    const key = e.currentTarget.dataset.key
    const list = routes.filter(item => {
      if (key === 'all') return true
      if (key === '1' || key === '2') return String(item.days) === key
      if (key === 'heritage') return item.tags.indexOf('非遗') > -1 || item.tags.indexOf('民俗') > -1
      if (key === 'family') return item.tags.indexOf('亲子') > -1 || item.tags.indexOf('农事体验') > -1
      return true
    })
    this.setData({ active: key, list })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/route/detail?id=' + e.currentTarget.dataset.id })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  onShareAppMessage() {
    return { title: '罗店镇精品旅游路线推荐', path: '/pages/route/list' }
  }
})
