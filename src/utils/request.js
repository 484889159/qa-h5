const baseUrl = 'http://localhost:8080/api'
export function request(url,data={},method='GET'){
  return new Promise((resolve,reject)=>{
    uni.request({ // 微信浏览器兼容fetch，也可直接用axios
      url:baseUrl+url,
      data,
      method,
      success:res=>resolve(res.data),
      fail:err=>reject(err)
    })
  })
}