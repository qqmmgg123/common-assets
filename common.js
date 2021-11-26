const CryptoJS = require('crypto-js');  //引用AES源码js    
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

//加密方法
export function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

//解密方法
export function Decrypt(word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

/**
 * 首字母大写
 * @param {*} word 
 * @returns 
 */
export const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.substring(1)
}

/**
 * 复制到剪贴板
 * @param {*} elem 
 * @returns 
 */
export const copyToClipboard = (elem) => {
  // create hidden text element, if it doesn't already exist
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    // can just use the original source element for the selection and copy
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement("textarea");
      target.style.position = "absolute";
      target.style.left = "-9999px";
      target.style.top = "0";
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent || elem;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }

  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = "";
  }
  return succeed;
}

/**
 * 滚动到顶部
 * @returns 
 */
export const scrollToTop = () => {
  let bodySrcollTop = document.body.scrollTop
  if (bodySrcollTop !== 0) {
    document.body.scrollTop = 0
    return
  }
  let docSrcollTop = document.documentElement.scrollTop
  if (docSrcollTop !== 0) {
    document.documentElement.scrollTop = 0
  }
}

// 时间计算
export const addTimes = (date, t = '1h') => {
  let number = parseInt(t);
  if (/\d+h$/.test(t)) { number = (number * 60 * 60 * 1000) }
  else if (/\d+s$/.test(t)) { number = number * 1000; }
  else if (/\d+m$/.test(t)) { number = number * 60 * 1000; }
  date = new Date(date.getTime() + number);
  return date;
}

// 转换当前本地时间为京八区时间
export const getBJDate = () => {
  let d = new Date(), currentDate = new Date(), tmpHours = currentDate.getHours()
  let time_zone = -d.getTimezoneOffset() / 60;
  if (time_zone < 0) {
    time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
  } else {
    time_zone -= 8; currentDate.setHours(tmpHours - time_zone)
  }
  return currentDate
}

// 倒计时
export const calcCountDownTime = (distance) => {
  return Math.floor(distance / 1000);
}
export const countDown = (date, onCountDowning = null, onCountDownFinished = null) => {
  let countDownDate = date.getTime();
  let now = new Date().getTime();
  let distance = countDownDate - now;

  if (distance <= 0) return;
  onCountDowning && onCountDowning(calcCountDownTime(distance))
  let x = setInterval(() => {
    let now = getBJDate().getTime();
    let distance = countDownDate - now;
    if (distance >= 0) {
      onCountDowning && onCountDowning(calcCountDownTime(distance));
    } else {
      clearInterval(x);
      onCountDownFinished && onCountDownFinished();
    }
  }, 1000);

  return x;
}

// 钱包地址格式化
// 地址处前后四位加密
export const formatAddress = (address = "", num = 4) => {
  if (typeof address !== 'string') {
    address = ""
  }
  var reg = new RegExp(`^(\\w{${num}}).*(\\w{${num}})$`);
  return address.replace(reg, "$1****$2");
}

/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} expire
 */
export const setCookie = (name, value, expire) => {
  document.cookie = name + "=" + escape(value) + ";expires=" + expire.toGMTString();
}

/**
 * 
 * @param {*} name 
 * @returns 
 */
export const getCookie = (name) => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

/**
 * 节流函数
 * 
 */
export function throttle(fn, time) {
  let canRun = true;
  return function () {
    if (!canRun) return;
    canRun = false
    setTimeout(() => {
      fn();
      canRun = true;
    }, time);
  }
}

/**
 * 
 */
export function htmlCompile(tpl, data = null) {
  tpl = tpl
    .replace(/\[\[/gm, "<strong>")
    .replace(/\]\]/gm, "</strong>")
    .replace(/\n/gm, "<br>");

  if (data) {
    tpl = tpl.replace(/#\s*([\w\.]+)\s*#/g, function () {
      var keys = arguments[1].split(".");
      var newData = data;
      for (var k = 0, l = keys.length; k < l; ++k)
        newData = newData[keys[k]];
      return newData;
    });
  }
  return tpl;
}
