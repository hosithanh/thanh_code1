import { FETCH_CAPNHATTIENDOSOHOA } from 'store/actions'
import { AppAction, CapnhattiendosohoaState } from 'store/interface'

const capnhattiendosohoaState: CapnhattiendosohoaState = {}

export default function capnhattiendosohoaReducer(
    state = capnhattiendosohoaState,
    action: AppAction
): CapnhattiendosohoaState {
    const { type, payload } = action
    switch (type) {
        case FETCH_CAPNHATTIENDOSOHOA:
            return {
                ...state,
                capnhattiendosohoaList: payload?.data?.result,
                total: payload?.data.pagination?.total,
                currentPage: payload?.data.pagination?.currentPage,
                pageSize: payload?.data.pagination?.pageSize ?? 10
            }
        default:
            break
    }
    return state
}
