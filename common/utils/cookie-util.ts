import Cookies from 'js-cookie'
import { ACCESS_TOKEN } from '../constant'

export function getCookie(key: string): string | undefined {
    return Cookies.get(key)
}

export function setCookie(key: string, value: string, minutes: number): string | undefined {
    var expires = new Date(new Date().getTime() + minutes * 60 * 1000)
    return Cookies.set(key, value, { expires: expires })
}

export function clearCookie(key: string): void {
    return Cookies.remove(key)
}

export const Authorization = (accessToken?: string) => ({
    headers: {
        Authorization: `Bearer ${accessToken ? accessToken : getCookie(ACCESS_TOKEN)}`
    }
})

export const XToken = `Bearer ${getCookie(ACCESS_TOKEN)}`
