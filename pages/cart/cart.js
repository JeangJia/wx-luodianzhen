// pages/cart/cart.js
const cart = require('../../utils/cart')
const { getProductById } = require('../../data/products')

const app = getApp()

Page({
  data: {
    list: [],
    allChecked: false,
    amount: '0.00',
    num: 0,
    cartCount: 0
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const summary = cart.summary()
    const list = summary.list
    this.setData({
      list,
      allChecked: list.length > 0 && summary.checked.length === list.length,
      amount: summary.amount.toFixed(2),
      num: summary.num,
      cartCount: app.refreshCart()
    })
  },

  onCheck(e) {
    cart.toggleCheck(e.currentTarget.dataset.key)
    this.refresh()
  },

  onCheckAll() {
    cart.toggleAll(!this.data.allChecked)
    this.refresh()
  },

  minus(e) {
    const key = e.currentTarget.dataset.key
    const item = this.data.list.find(one => one.key === key)
    if (!item || item.qty <= 1) return
    cart.setQty(key, item.qty - 1)
    this.refresh()
  },

  plus(e) {
    const key = e.currentTarget.dataset.key
    const item = this.data.list.find(one => one.key === key)
    if (!item) return
    const product = getProductById(item.id)
    if (product && item.qty >= product.stock) {
      wx.showToast({ title: '已达到库存上限', icon: 'none' })
      return
    }
    cart.setQty(key, item.qty + 1)
    this.refresh()
  },

  onRemove(e) {
    const key = e.currentTarget.dataset.key
    wx.showModal({
      title: '提示',
      content: '确定要移除这件商品吗？',
      success: res => {
        if (res.confirm) {
          cart.remove(key)
          this.refresh()
        }
      }
    })
  },

  clearAll() {
    if (!this.data.list.length) return
    wx.showModal({
      title: '清空购物车',
      content: '确定要清空购物车中的所有商品吗？',
      success: res => {
        if (res.confirm) {
          cart.clear()
          this.refresh()
        }
      }
    })
  },

  checkout() {
    const checked = this.data.list.filter(item => item.checked)
    if (!checked.length) {
      wx.showToast({ title: '请先选择要结算的商品', icon: 'none' })
      return
    }
    cart.setCheckout(checked, 'cart')
    wx.navigateTo({ url: '/pages/order/confirm' })
  },

  goShopping() {
    wx.switchTab({ url: '/pages/product/list' })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/product/detail?id=' + e.currentTarget.dataset.id })
  },

  onShareAppMessage() {
    return { title: '罗店镇农产品商城 · 产地直供', path: '/pages/product/list' }
  }
})
