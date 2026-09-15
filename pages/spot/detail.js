// pages/spot/detail.js
const { spots, getSpotById } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')

Page({
  data: {
    spot: null,
    relatedRoutes: [],
    nearby: [],
    relatedProducts: []
  },

  onLoad(options) {
    const spot = getSpotById(options.id) || spots[0]
    const relatedRoutes = routes.filter(route =>
      route.itinerary.some(day => day.items.some(item => item.spotId === spot.id))
    )
    const nearby = spots
      .filter(item => item.id !== spot.id && item.category === spot.category)
      .slice(0, 3)

    this.setData({
      spot,
      relatedRoutes,
      nearby,
      relatedProducts: products.slice(0, 3)
    })
    wx.setNavigationBarTitle({ title: spot.name })
  },

  callSpot() {
    const phone = this.data.spot.phone || ''
    if (!phone || phone.indexOf('x') > -1) {
      wx.showToast({ title: '演示数据，请替换为真实电话', icon: 'none' })
      return
    }
    wx.makePhoneCall({ phoneNumber: phone.replace(/-/g, '') })
  },

  openMap() {
    const { spot } = this.data
    wx.openLocation({
      latitude: spot.lat,
      longitude: spot.lng,
      name: spot.name,
      address: spot.address,
      scale: 14
    })
  },

  copyAddress() {
    wx.setClipboardData({
      data: this.data.spot.address,
      success: () => wx.showToast({ title: '地址已复制', icon: 'none' })
    })
  },

  goRoute(e) {
    wx.navigateTo({ url: '/pages/route/detail?id=' + e.currentTarget.dataset.id })
  },

  goSpot(e) {
    wx.redirectTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  goProduct(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  onShareAppMessage() {
    const { spot } = this.data
    return {
      title: spot.name + ' · 罗店镇景点导览',
      path: '/pages/spot/detail?id=' + spot.id
    }
  }
})
