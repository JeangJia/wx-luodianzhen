// pages/route/detail.js
const { routes, getRouteById } = require('../../data/routes')
const { getSpotById } = require('../../data/spots')
const { products } = require('../../data/products')

Page({
  data: {
    route: null,
    days: [],
    spotCount: 0,
    relatedProducts: []
  },

  onLoad(options) {
    const route = getRouteById(options.id) || routes[0]

    const spotIds = []
    const days = route.itinerary.map(day => ({
      day: day.day,
      title: day.title,
      items: day.items.map(item => {
        const spot = item.spotId ? getSpotById(item.spotId) : null
        if (spot && spotIds.indexOf(spot.id) === -1) spotIds.push(spot.id)
        return Object.assign({}, item, { spot })
      })
    }))

    this.setData({
      route,
      days,
      spotCount: spotIds.length,
      relatedProducts: products.slice(0, 2)
    })
    wx.setNavigationBarTitle({ title: route.name })
  },

  goSpot(e) {
    wx.navigateTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  openMap(e) {
    const { lat, lng, title, town } = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      name: title,
      address: town,
      scale: 14
    })
  },

  callService() {
    wx.makePhoneCall({ phoneNumber: '07127622000' })
  },

  copyPlan() {
    const { route, days } = this.data
    const lines = ['【' + route.name + '】', route.summary, '']
    days.forEach(day => {
      lines.push('D' + day.day + ' ' + day.title)
      day.items.forEach(item => {
        lines.push('  ' + item.time + ' ' + item.title + (item.note ? '（' + item.note + '）' : ''))
      })
      lines.push('')
    })
    lines.push('—— 由「游罗店」小程序生成')

    wx.setClipboardData({
      data: lines.join('\n'),
      success: () => wx.showToast({ title: '行程已复制，可粘贴分享', icon: 'none' })
    })
  },

  goProduct(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  onShareAppMessage() {
    const { route } = this.data
    return {
      title: route.name + ' · ' + route.days + '日游推荐',
      path: '/pages/route/detail?id=' + route.id
    }
  }
})
