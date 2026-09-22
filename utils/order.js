// utils/order.js 订单（本地存储实现，接入后端后可替换为接口）
const KEY = 'ldz_order_list'

function pad(n) {
  return n > 9 ? '' + n : '0' + n
}

function nowText() {
  const d = new Date()
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

function getOrders() {
  return wx.getStorageSync(KEY) || []
}

function saveOrders(list) {
  wx.setStorageSync(KEY, list)
  return list
}

// order: { items, amount, address, remark, contact }
function create(order) {
  const list = getOrders()
  const d = new Date()
  const record = Object.assign({}, order, {
    id: 'LD' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()),
    status: 'unpaid',
    statusText: '待付款',
    createdAt: nowText()
  })
  list.unshift(record)
  saveOrders(list)
  return record
}

function updateStatus(id, status, statusText) {
  const list = getOrders().map(item => {
    if (item.id === id) {
      item.status = status
      item.statusText = statusText
    }
    return item
  })
  return saveOrders(list)
}

// 只改收货信息，订单的其他字段（商品、金额、时间、状态）一律不动
function updateAddress(id, address) {
  const list = getOrders().map(item => {
    if (item.id === id) item.address = address
    return item
  })
  return saveOrders(list)
}

function remove(id) {
  return saveOrders(getOrders().filter(item => item.id !== id))
}

function countByStatus(status) {
  return getOrders().filter(item => item.status === status).length
}

module.exports = {
  getOrders,
  create,
  updateStatus,
  updateAddress,
  remove,
  countByStatus
}
