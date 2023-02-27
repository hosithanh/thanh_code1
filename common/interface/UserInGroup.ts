import { UserGroup } from './UserGroup'
export interface UserInGroup {
    id: number
    ten: string
    donvi: string
    nhomnguoidungs?: UserGroup[]
    name: string
}
