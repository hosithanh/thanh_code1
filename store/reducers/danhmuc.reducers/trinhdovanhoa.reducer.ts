import { FETCH_TRINHDOVANHOA } from './../../actions/index';
import { AppAction, TrinhdovanhoaState } from 'store/interface';

const trinhdovanhoaState: TrinhdovanhoaState ={}

export default function trinhdovanhoaReducer(state = trinhdovanhoaState, action: AppAction): TrinhdovanhoaState {
    const { type, payload } = action

    switch (type) {
        case FETCH_TRINHDOVANHOA:
            return {
                ...state,
                trinhdovanhoaList: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break;
    }
    return state
}