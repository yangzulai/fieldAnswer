import axios from 'axios';
import baseURL from '../services/baseUrl'
import router from '../router';
import utils from '../services/utils'

var baseUrl = baseURL;

export default {
	get(_url, _params){
		var url = _url && _url.startsWith('http') ? _url : `${baseUrl}/${_url}`;
		return new Promise((resolve, reject) => {
 			axios({
                url: url,
				params: _params || {},
				headers: {token: utils.getFromStorage("access_token")}
            }).then(res => {
				// if(res.status == 403){
				// 	router.replace('login');
				// 	// return false;
				// 	throw new Error("您没有该权限");
				// }
				resolve(res)
			}).catch(error => {
				if(error.response.status == 403){
					router.replace('login');
				}
            	reject(error)
            })
		})
	},
	post(_url, _params, cancelToken) {
		var url = _url && _url.startsWith('http') ? _url : `${baseUrl}/${_url}`;
		return new Promise((resolve, reject) => {
 			axios({
				withCredentials : true,
				crossDomain:true,
				url: url,
				method: 'post',
				data: _params || {},
				headers: {
					'Content-Type': 'application/json;charset=UTF-8;',
					token: utils.getFromStorage("access_token")
				 },
				transformRequest: [function (data) {
					let ret =JSON.stringify(data) 
					// for (let it in data) {
					//   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// }
                    return ret
					}], 
				cancelToken: cancelToken
				}).then(res => {			
					resolve(res)
				}).catch(error => {
					if(error.response.status == 403){
						router.replace('login');
					}
					reject(error)
				})
		})
	},
	put(_url, _params){
		var url = _url && _url.startsWith('http') ? _url : `${baseUrl}/${_url}`;
		return new Promise((resolve, reject) => {
 			axios({
 				withCredentials : true,
				url: url,
				method: 'post',
				data: _params || {},
				headers: {
				 	'Content-Type': 'application/json;charset=UTF-8;',
					 token: utils.getFromStorage("access_token")
				 },
				transformRequest: [function (data) {
					let ret =JSON.stringify(data) 
					// for (let it in data) {
					//   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// }
                    return ret
				  }], 
            }).then(res => {
				// if(res.status == 403){
				// 	router.replace('login');
				// 	throw new Error("您没有该权限");
				// }				
                resolve(res)
            }).catch(error => {
				if(error.response.status == 403){
					router.replace('login');
				}
            	reject(error)
            })
		})
	},
	delete(_url, _params){
		var url = _url && _url.startsWith('http') ? _url : `${baseUrl}/${_url}`;
		return new Promise((resolve, reject) => {
 			axios({
 				withCredentials : true,
				url: url,
				method: 'delete',
				data: _params || {},
				headers: {
				 	'Content-Type': 'application/json;charset=UTF-8;',
					 token: utils.getFromStorage("access_token")
				 },
				transformRequest: [function (data) {
					let ret =JSON.stringify(data) 
					// for (let it in data) {
					//   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// }
                    return ret
				  }], 
            }).then(res => {
				// if(res.status == 403){
				// 	router.replace('login');
				// 	// return false;
				// 	throw new Error("您没有该权限");
				// }				
                resolve(res)
            }).catch(error => {
				if(error.response.status == 403){
					router.replace('login');
				}
            	reject(error)
            })
		})
	},
	CancelToken: axios.CancelToken,
	isCancel: axios.isCancel
}