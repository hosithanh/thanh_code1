import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { getCookie } from './cookie-util'

export const downloadFile = (url, ma, name) => {
    axios({
        url: `${url}/${ma}`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
    }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', name)
        document.body.appendChild(link)
        link.click()
    })
}
