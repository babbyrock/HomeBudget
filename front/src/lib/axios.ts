import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({ baseURL: '/' })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.erro ?? 'Erro inesperado.'
    toast.error(msg)
    return Promise.reject(new Error(msg))
  }
)

export default api