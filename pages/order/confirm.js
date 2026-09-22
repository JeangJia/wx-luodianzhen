// pages/order/confirm.js
const cart = require('../../utils/cart')
const order = require('../../utils/order')

function toast(title) {
  wx.showToast({ title, icon: 'none' })
}

Page({
  data: {
    items: [],
    num: 0,
    amount: '0.00',
    total: '0.00',
    from: 'buy',
    name: '',
    phone: '',
    detail: '',
    remark: '',
    submitting: false
  },

  onLoad() {
    const checkout = cart.getCheckout()
    const items = checkout.items || []

    if (!items.length) {
      toast('没有待结算的商品')
      setTimeout(() => wx.navigateBack(), 800)
      return
    }

    const num = items.reduce((sum, item) => sum + item.qty, 0)
    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const saved = wx.getStorageSync('ldz_address') || {}

    this.setData({
      items,
      num,
      from: checkout.from,
      amount: amount.toFixed(2),
      total: amount.toFixed(2),
      name: saved.name || '',
      phone: saved.phone || '',
      detail: saved.detail || ''
    })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [field]: e.detail.value })
  },

  callService() {
    // 演示号码，上线前请替换为真实服务电话
    wx.makePhoneCall({ phoneNumber: '02156860000' })
  },

  submit() {
    if (this.data.submitting) return

    const { name, phone, detail, items, total, from, remark } = this.data

    if (!name.trim()) return toast('请填写收货人姓名')
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) return toast('请填写正确的手机号')
    if (detail.trim().length < 5) return toast('请填写详细收货地址')

    this.setData({ submitting: true })

    const record = order.create({
      items,
      total: Number(total),
      address: { name: name.trim(), phone: phone.trim(), detail: detail.trim() },
      remark: remark.trim()
    })

    wx.setStorageSync('ldz_address', {
      name: name.trim(),
      phone: phone.trim(),
      detail: detail.trim()
    })

    if (from === 'cart') {
      cart.remove(items.map(item => item.key))
    }
    cart.clearCheckout()

    setTimeout(() => {
      this.setData({ submitting: false })
      wx.showToast({ title: '下单成功', icon: 'success' })
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/order/list?status=unpaid' })
      }, 700)
    }, 400)

    return record
  }
})
