import { FETCH_CONFIG } from '../actions'
import { AppAction, ConfigState } from '../interface'

const configState: ConfigState = {}

export default function configReducer(state = configState, action: AppAction): ConfigState {
    const { type, payload } = action
    switch (type) {
        case FETCH_CONFIG:
            return {
                ...state,
                configList: payload.data?.result,
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
