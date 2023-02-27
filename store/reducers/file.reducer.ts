import { FETCH_FILES } from 'store/actions'
import { AppAction, FileState } from '../interface'

const fileState: FileState = {}

export default function fileReducer(state = fileState, action: AppAction): FileState {
    const { type, payload } = action

    switch (type) {
        case FETCH_FILES:
            return {
                ...state,
                files: payload?.data?.items,
                totalRecords: payload?.data?.pagination?.total,
                currentPage: payload?.data?.pagination?.currentPage,
                pageSize: payload?.pageSize ?? 10,
                dataSearch: payload?.dataSearch
            }

        default:
            break
    }
    return state
}
