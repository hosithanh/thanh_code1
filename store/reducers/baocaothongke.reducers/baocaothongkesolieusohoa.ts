import { FETCH_BAOCAOTHONGKESOLIEUSOHOA } from 'store/actions'
import { AppAction, BaoCaoThongKeSoLieuSoHoaState } from 'store/interface'

const baocaothongkesolieusohoaState: BaoCaoThongKeSoLieuSoHoaState = {}

export default function baocaothongkesolieusohoaReducer(
    state = baocaothongkesolieusohoaState,
    action: AppAction
): BaoCaoThongKeSoLieuSoHoaState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAOTHONGKESOLIEUSOHOA:
            return {
                ...state,
                baocaothongkesolieusohoaList: payload?.data
            }
        default:
            break
    }
    return state
}
