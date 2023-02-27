import axios from "axios"
import { BASE_URL } from "common/constant/api-constant"

const api = axios.create({
    baseURL: BASE_URL
})

export default api
