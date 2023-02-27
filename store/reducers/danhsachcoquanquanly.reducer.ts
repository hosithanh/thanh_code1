import { FETCH_DANHSACHCOQUANQUANLY } from 'store/actions'
import { AppAction, DanhsachcoquanquanlyState } from '../interface'

const danhsachcoquanquanlyState: DanhsachcoquanquanlyState = {}

export default function danhsachcoquanquanlyReducer(
    state = danhsachcoquanquanlyState,
    action: AppAction
): DanhsachcoquanquanlyState {
    const { type, payload } = action

    switch (type) {
        case FETCH_DANHSACHCOQUANQUANLY:
            return {
                ...state,
                danhsachcoquanquanlyList: payload?.data.items,
                totalRecords: payload?.data.pagination?.total,
                currentPage: payload?.data.pagination?.currentPage,
                pageSize: payload?.data.pagination?.pageSize
            }
        default:
            break
    }
    return state
}
