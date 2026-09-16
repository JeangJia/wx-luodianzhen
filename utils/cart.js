// utils/cart.js 购物车（本地存储实现，接入后端后可替换为接口）
const KEY = 'ldz_cart_list'
const CHECKOUT_KEY = 'ldz_checkout'

function getCart() {
  return wx.getStorageSync(KEY) || []
}

function saveCart(list) {
  wx.setStorageSync(KEY, list)
  return list
}

function keyOf(productId, spec) {
  return productId + '|' + (spec || '')
}

// 加入购物车，product 为商品对象，spec 为规格文本
function add(product, spec, qty) {
  const list = getCart()
  const key = keyOf(product.id, spec)
  const index = list.findIndex(item => item.key === key)
  if (index > -1) {
    list[index].qty += qty || 1
  } else {
    list.push({
      key,
      id: product.id,
      name: product.name,
      cover: product.cover,
      theme: product.theme,
      spec: spec || (product.specs && product.specs[0]) || '',
      price: product.price,
      unit: product.unit,
      qty: qty || 1,
      checked: true
    })
  }
  return saveCart(list)
}

function setQty(key, qty) {
  let list = getCart()
  list = list.map(item => {
    if (item.key === key) item.qty = qty
    return item
  }).filter(item => item.qty > 0)
  return saveCart(list)
}

function toggleCheck(key) {
  const list = getCart().map(item => {
    if (item.key === key) item.checked = !item.checked
    return item
  })
  return saveCart(list)
}

function toggleAll(checked) {
  const list = getCart().map(item => {
    item.checked = checked
    return item
  })
  return saveCart(list)
}

function remove(keys) {
  const arr = Array.isArray(keys) ? keys : [keys]
  return saveCart(getCart().filter(item => arr.indexOf(item.key) === -1))
}

function clear() {
  return saveCart([])
}

// 商品件数（用于角标）
function count() {
  return getCart().reduce((sum, item) => sum + item.qty, 0)
}

// 已勾选商品的合计
function summary() {
  const list = getCart()
  const checked = list.filter(item => item.checked)
  const amount = checked.reduce((sum, item) => sum + item.price * item.qty, 0)
  const num = checked.reduce((sum, item) => sum + item.qty, 0)
  return { list, checked, amount, num }
}

/* ---------- 结算临时数据 ---------- */
// items: 待结算商品数组；from: 'cart' 表示来自购物车，下单后需从购物车移除
function setCheckout(items, from) {
  wx.setStorageSync(CHECKOUT_KEY, { from: from || 'buy', items: items || [] })
}

function getCheckout() {
  return wx.getStorageSync(CHECKOUT_KEY) || { from: 'buy', items: [] }
}

function clearCheckout() {
  wx.removeStorageSync(CHECKOUT_KEY)
}

module.exports = {
  getCart,
  add,
  setQty,
  toggleCheck,
  toggleAll,
  remove,
  clear,
  count,
  summary,
  setCheckout,
  getCheckout,
  clearCheckout
}
