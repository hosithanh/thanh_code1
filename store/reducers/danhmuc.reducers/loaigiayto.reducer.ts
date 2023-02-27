import { AppAction, LoaigiaytoState } from 'store/interface'
import { FETCH_LOAIGIAYTO } from '../../actions/index'

const loaigiaytoState: LoaigiaytoState = {}

export default function loaiGiayToReducer(state = loaigiaytoState, action: AppAction): LoaigiaytoState {
    const { type, payload } = action

    switch (type) {
        case FETCH_LOAIGIAYTO:
            return {
                ...state,
                loaigiaytoList: payload?.data?.result,
                totalRecords: payload?.data?.pagination?.total,
                currentPage: payload?.data?.pagination?.currentPage,
                pageSize: payload?.data?.pagination?.pageSize,
                searchData: payload?.data?.searchData,
                sortData: payload?.data?.sortData
            }
        default:
            break
    }
    return state
}
