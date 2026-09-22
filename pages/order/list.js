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
    list: [],
    // tab 滑动下划线
    lineWidth: 0,
    lineLeft: 0,
    lineReady: false,
    // 收货信息编辑弹层
    editShow: false,
    editId: '',
    editName: '',
    editPhone: '',
    editDetail: ''
  },

  onLoad(options) {
    this.setData({ active: options.status || 'all' }, () => this.refresh())
  },

  onShow() {
    this.refresh()
  },

  onReady() {
    this.measureTabs()
  },

  onResize() {
    // 屏幕尺寸变化后 tab 位置会变，重新测一次
    this.measureTabs()
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key
    if (key === this.data.active) return
    this.setData({ active: key }, () => {
      this.refresh()
      // 选中项是加粗的，字宽会比未选中时略宽，切完重测一次让下划线贴合
      this.measureTabs()
    })
  },

  /**
   * 下划线要和文字同宽，写死宽度不行（“全部”两个字、“待付款”三个字），
   * 所以用 boundingClientRect 实测每个 tab 文字的 left / width，
   * 再换算成相对 .tabs 的偏移
   */
  measureTabs() {
    wx.createSelectorQuery()
      .selectAll('.tab-txt')
      .boundingClientRect()
      .select('.tabs')
      .boundingClientRect()
      .exec(res => {
        const tabRects = res[0]
        const bar = res[1]
        if (!tabRects || !tabRects.length || !bar) return
        this.tabRects = tabRects
        this.tabsLeft = bar.left
        this.moveTabLine()
      })
  },

  moveTabLine() {
    const rects = this.tabRects
    if (!rects) return
    const index = Math.max(0, this.data.tabs.findIndex(item => item.key === this.data.active))
    const rect = rects[index]
    if (!rect) return
    this.setData({
      lineWidth: rect.width,
      lineLeft: rect.left - this.tabsLeft
    }, () => {
      // 首次定位不参与过渡，否则下划线会从左侧“长”出来
      if (!this.lineReady) {
        this.lineReady = true
        setTimeout(() => this.setData({ lineReady: true }), 60)
      }
    })
  },

  refresh() {
    const all = order.getOrders()
    const list = (this.data.active === 'all'
      ? all
      : all.filter(item => item.status === this.data.active)
    // canEdit 预先算好，WXML 里直接绑定，省得在模板里写状态判断
    ).map(item => Object.assign({}, item, {
      canEdit: item.status === 'unpaid' || item.status === 'paid'
    }))
    this.setData({ list })
  },

  /* ---------- 修改收货信息 ---------- */

  openAddressEdit(e) {
    const item = this.data.list.find(o => o.id === e.currentTarget.dataset.id)
    if (!item) return
    if (!item.canEdit) {
      wx.showToast({ title: '当前状态不可修改收货信息', icon: 'none' })
      return
    }
    const addr = item.address || {}
    this.setData({
      editShow: true,
      editId: item.id,
      editName: addr.name || '',
      editPhone: addr.phone || '',
      editDetail: addr.detail || ''
    })
  },

  closeAddressEdit() {
    this.setData({ editShow: false })
  },

  onAddrInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },

  saveAddress() {
    const name = this.data.editName.trim()
    const phone = this.data.editPhone.trim()
    const detail = this.data.editDetail.trim()

    if (!name) return wx.showToast({ title: '请填写收货人', icon: 'none' })
    if (!/^1\d{10}$/.test(phone)) return wx.showToast({ title: '请填写 11 位手机号', icon: 'none' })
    if (!detail) return wx.showToast({ title: '请填写收货地址', icon: 'none' })

    order.updateAddress(this.data.editId, { name, phone, detail })
    this.setData({ editShow: false })
    this.refresh()
    wx.showToast({ title: '收货信息已更新', icon: 'none' })
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
    // 演示号码，上线前请替换为真实服务电话
    wx.makePhoneCall({ phoneNumber: '02156860000' })
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
