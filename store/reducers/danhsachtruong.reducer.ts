import { FETCH_DANHSACHTRUONG } from '../actions'
import { AppAction, DanhsachtruongState } from '../interface'

const danhsachtruongState: DanhsachtruongState = {}

export default function danhsachtruongReducer(state = danhsachtruongState, action: AppAction): DanhsachtruongState {
    const { type, payload } = action
    switch (type) {
        case FETCH_DANHSACHTRUONG:
            return {
                ...state,
                danhsachtruongList: payload.data?.items,
                totalRecords: payload.data?.pagination?.total,
                currentPage: payload.data?.pagination?.currentPage,
                pageSize: payload.data?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
