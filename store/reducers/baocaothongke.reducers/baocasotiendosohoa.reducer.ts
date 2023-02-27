import { FETCH_BAOCAOTIENDOSOHOA } from 'store/actions'
import { AppAction, BaocaoiendosohoaState } from 'store/interface'

const baocaotiendosohoaState: BaocaoiendosohoaState = {}

export default function baocaotiendosohoaReducer(
    state = baocaotiendosohoaState,
    action: AppAction
): BaocaoiendosohoaState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAOTIENDOSOHOA:
            return {
                ...state,
                tiendosohoaList: payload?.data?.result,
                total: payload?.data.pagination?.total,
                currentPage: payload?.data.pagination?.currentPage,
                pageSize: payload?.data.pagination?.pageSize ?? 10
            }
        default:
            break
    }
    return state
}
