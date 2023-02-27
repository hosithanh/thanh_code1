import { Donvi } from './Donvi'
import { UserGroup } from './UserGroup'

export interface User {
    id: number
    ten: string
    donVi: Donvi
    nhomnguoidungs?: UserGroup[]
    name: string
    user: UserInfo
    fullName: string
    email: string
    phoneNumber: string
    regency: string
    isRoot: boolean
    tenphongban: string
    role: any
}

export interface UserInfo {
    username: string
    nguoiDung?: User
}
