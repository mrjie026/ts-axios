import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
console.log('source', source)
axios
  .get('/cancel/get', {
    cancelToken: source.token
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled1', e.message)
    }
  })

setTimeout(() => {
  setTimeout(() => {
    source.cancel('Operation canceled by the user.')
    console.log('post source - ', source.token, source)
    axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
      if (axios.isCancel(e)) {
        console.log(e.message)
      }
    })
  }, 100)
}, 100)

let cancel: Canceler

axios
  .get('/cancel/get', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled 2')
    }
  })

setTimeout(() => {
  cancel()
}, 500)
