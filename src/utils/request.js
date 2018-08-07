import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN
const instance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${ACCESS_TOKEN}`
  }
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

export const get = (path, params = {}) => {
  const searchParams = Object.keys(params).map(key => {
    return params[key] !== '' ? encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) : ''
  }).filter(item => item !== '').join('&')
  return instance.get(`${API_URL}/${path}?${searchParams}`)
    .then(response => response.data)
    .catch(function (error) {
      // handleError(error)
    });
}

export const post = (path, params) => {
  console.log("post form value is", params);
  const url = path ? `${API_URL}/${path}` : API_URL
  return instance({
      method: 'post',
      url,
      data: params
    })
    .then(response => response.data)
    .catch(function (error) {
      // handleError(error)
    });
}




