import CryptoJS from 'crypto-js';
var key = CryptoJS.enc.Utf8.parse('cDOoncFueMreENcT');
var iv = CryptoJS.enc.Utf8.parse('Con-ere-ceD-cumt');

function AESCrypto(target) {
    if(!target) return "";
    target = target.toString();
    return target;
    var result = CryptoJS.AES.encrypt(target, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return result.toString();
}


function AESDecrypt(target) {
    return JSON.stringify(target);
    if(!target) return "";
    var decrypted = CryptoJS.AES.decrypt(target, key,{
        iv:iv,
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function MD5(target) {
    return target;
    var result = CryptoJS.MD5(target).toString();
    return result;
} 

function countdown(value, now) {
    if (!value) return '';
    var diff = (value - now)/1000;
    if(diff < 0) return '-- : --';
    // var hour = parseInt(diff/3600);
    // diff = diff - hour * 3600;
    var minute = parseInt(diff/60);
    diff = diff - minute * 60;
    var second = parseInt(diff);

    return `${addZero(minute)} : ${addZero(second)}`;
}

function addZero(num) {
    if(num <= 9) return '0'+num;
    return num;
}

function setStorage(name, content) {
    window.localStorage.setItem(name, JSON.stringify(content));
}

function getFromStorage(name) {
    return JSON.parse(window.localStorage.getItem(name));
}

function removeFromStroage(name) { 
    window.localStorage.removeItem(name);
}

export default {
    AESCrypto,
    AESDecrypt,
    MD5,
    countdown,
    setStorage,
    getFromStorage,
    removeFromStroage
}