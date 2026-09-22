// pages/product/detail.js
const { products, getProductById } = require('../../data/products')
const { spots } = require('../../data/spots')
const cart = require('../../utils/cart')

const app = getApp()

Page({
  data: {
    product: null,
    specIndex: 0,
    qty: 1,
    cartCount: 0,
    relatedSpots: [],
    recommend: []
  },

  onLoad(options) {
    const product = getProductById(options.id) || products[0]
    this.setData({
      product,
      specIndex: 0,
      qty: 1,
      relatedSpots: spots.filter(item => item.category === '田园农趣').slice(0, 2),
      recommend: products.filter(item => item.id !== product.id).slice(0, 3)
    })
    wx.setNavigationBarTitle({ title: product.name })
  },

  onShow() {
    this.setData({ cartCount: app.refreshCart() })
  },

  onSpecTap(e) {
    this.setData({ specIndex: Number(e.currentTarget.dataset.index) })
  },

  minus() {
    if (this.data.qty <= 1) return
    this.setData({ qty: this.data.qty - 1 })
  },

  plus() {
    const { product, qty } = this.data
    if (qty >= product.stock) {
      wx.showToast({ title: '已达到库存上限', icon: 'none' })
      return
    }
    this.setData({ qty: qty + 1 })
  },

  currentSpec() {
    const { product, specIndex } = this.data
    return (product.specs && product.specs[specIndex]) || ''
  },

  addToCart() {
    const { product, qty } = this.data
    cart.add(product, this.currentSpec(), qty)
    this.setData({ cartCount: app.refreshCart() })
    wx.showToast({ title: '已加入购物车', icon: 'none' })
  },

  buyNow() {
    const { product, qty } = this.data
    cart.setCheckout([{
      key: 'buy_' + Date.now(),
      id: product.id,
      name: product.name,
      cover: product.cover,
      theme: product.theme,
      spec: this.currentSpec(),
      price: product.price,
      unit: product.unit,
      qty
    }], 'buy')
    wx.navigateTo({ url: '/pages/order/confirm' })
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/cart' })
  },

  goProduct(e) {
    wx.redirectTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  goSpot(e) {
    wx.navigateTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  callService() {
    // 演示号码，上线前请替换为真实服务电话
    wx.makePhoneCall({ phoneNumber: '02156860000' })
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: product.name + ' · 罗店镇农产品直供',
      path: '/pages/product/detail?id=' + product.id
    }
  }
})
