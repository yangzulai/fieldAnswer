
/**
 * 根据当前平台获取和飞信能力容器(webContainer对象)
 * @returns {Object}
 */
function clientWebContaner () {
    if (window.navigator.WebContainer) {
      return window.navigator.WebContainer
    } else if (window.WebContainer) {
      return window.WebContainer
    } else {
      alert('请使用和飞信手机客户端打开')
      return {}
    }
  }
  
  /**
   * 生成全局函数，用于处理和飞信能力平台的回调
   * @param {String} backId 回调标示id
   * @param {String} backFunc 回调函数名(全局函数)
   * @param {Function} callback 回调
   */
  function handleCallback (backId, backFunc, callback) {
    console.log("handle")
    window[backFunc] = function (arg1, arg2) {
      let bId, data
      if (typeof arg1 === 'undefined' && typeof arg2 === 'undefined') {
        // 无参数
        if (typeof callback === 'function') {
          callback() // 直接调用
        }
        window[backFunc] = null
        delete window[backFunc] // 销毁全局函数
        return
      } else if (typeof arg2 === 'undefined') {
        // 只有一个参数
        data = arg1
      } else {
        // 两个参数都不为空
        bId = arg1
        data = arg2
      }
      try {
        data = JSON.parse(data)
      } catch (e) {
        console.log(e)
      }
  
      if (bId) {
        if (bId === backId) {
          if (typeof callback === 'function') {
            callback(data)
          }
          window[backFunc] = null
          delete window[backFunc]
        }
      } else {
        if (typeof callback === 'function') {
          callback(data)
        }
        window[backFunc] = null
        delete window[backFunc]
      }
    }
  }

  // 获取当前用户在当前企业的信息
  function getEnterpriseContact (callback) {
    let rand = Math.floor(Math.random() * 10000000)
    let backId = `backId_${rand}` // 回调标示id
    let backFunc = `backFunc_${rand}` // 全局回调函数名
    handleCallback(backId, backFunc, callback) // 生成全局回调函数
    let wc = clientWebContaner()
    wc.getEnterpriseContact(backId, backFunc) // 调用
  }

  function getContactAvatar(phone, callback) {
    let rand = Math.floor(Math.random() * 10000000)
    let backId = `backId_${rand}` // 回调标示id
    let backFunc = `backFunc_${rand}` // 全局回调函数名
    console.log(backId,"backid")
    handleCallback(backId, backFunc, callback) // 生成全局回调函数
    let params = {
        backId: backId,
        backFunc: backFunc,
        phone: phone
    };
    let wc = clientWebContaner()
    wc.getContactAvatar(JSON.stringify(params));
  }


  export default {
    clientWebContaner,
    getEnterpriseContact,
    getContactAvatar,
  }