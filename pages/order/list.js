// pages/order/list.js
const order = require('../../utils/order')

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'unpaid', name: '待付款' },
  { key: 'paid', name: '待收货' },
  { key: 'done', name: '已完成' }
]

Page({
  data: {
    tabs,
    active: 'all',
    list: []
  },

  onLoad(options) {
    this.setData({ active: options.status || 'all' }, () => this.refresh())
  },

  onShow() {
    this.refresh()
  },

  onTabTap(e) {
    this.setData({ active: e.currentTarget.dataset.key }, () => this.refresh())
  },

  refresh() {
    const all = order.getOrders()
    const list = this.data.active === 'all'
      ? all
      : all.filter(item => item.status === this.data.active)
    this.setData({ list })
  },

  pay(e) {
    order.updateStatus(e.currentTarget.dataset.id, 'paid', '待收货')
    this.refresh()
    wx.showToast({ title: '支付成功', icon: 'success' })
  },

  confirmReceive(e) {
    wx.showModal({
      title: '确认收货',
      content: '请确认已收到商品，确认后订单将完成',
      success: res => {
        if (res.confirm) {
          order.updateStatus(e.currentTarget.dataset.id, 'done', '已完成')
          this.refresh()
        }
      }
    })
  },

  cancel(e) {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消这笔订单吗？',
      success: res => {
        if (res.confirm) {
          order.updateStatus(e.currentTarget.dataset.id, 'cancelled', '已取消')
          this.refresh()
        }
      }
    })
  },

  remove(e) {
    wx.showModal({
      title: '删除订单',
      content: '删除后无法恢复，确定继续吗？',
      success: res => {
        if (res.confirm) {
          order.remove(e.currentTarget.dataset.id)
          this.refresh()
        }
      }
    })
  },

  callService() {
    wx.makePhoneCall({ phoneNumber: '07127622000' })
  },

  copyOrderId(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success: () => wx.showToast({ title: '订单号已复制', icon: 'none' })
    })
  },

  goShopping() {
    wx.switchTab({ url: '/pages/product/list' })
  },

  onShareAppMessage() {
    return { title: '罗店镇农产品商城 · 产地直供', path: '/pages/product/list' }
  }
})
