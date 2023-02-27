interface Menu {
    id?: number
    url?: string
    permission?: string
    sort?: number
    type?: number
    note?: string
    name?: string
    icon?: string
    idParent?: number
    isEnable?: number
    idChucNang?: string
    key?: number
    title?: string
    invisible?: boolean
}
export interface MenuPermission extends Menu {
    children?: Menu[]
}
