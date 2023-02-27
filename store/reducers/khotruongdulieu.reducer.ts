import { FETCH_KHOTRUONGDULIEU } from '../actions'
import { AppAction, KhotruongdulieuState } from '../interface'

const khotruongdulieuState: KhotruongdulieuState = {}

export default function khotruongdulieuReducer(state = khotruongdulieuState, action: AppAction): KhotruongdulieuState {
    const { type, payload } = action
    switch (type) {
        case FETCH_KHOTRUONGDULIEU:
            return {
                ...state,
                khotruongdulieuList: payload.data?.items,
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
