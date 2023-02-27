import { AppAction, GopLoaigiaytoState } from 'store/interface'
import { FETCH_GOPLOAIGIAYTO } from '../../actions/index'

const goploaigiaytoState: GopLoaigiaytoState = {}

export default function goploaiGiayToReducer(state = goploaigiaytoState, action: AppAction): GopLoaigiaytoState {
    const { type, payload } = action

    switch (type) {
        case FETCH_GOPLOAIGIAYTO:
            return {
                ...state,
                goploaigiaytoList: payload?.data?.result,
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
