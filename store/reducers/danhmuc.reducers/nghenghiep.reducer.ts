import {  FETCH_NGHENGHIEP } from './../../actions/index';
import { AppAction, NghenghiepState } from 'store/interface'

const nghenghiepState: NghenghiepState ={}

export default function nghenghiepReducer(state = nghenghiepState, action: AppAction): NghenghiepState {
    const { type, payload } = action

    switch (type) {
        case FETCH_NGHENGHIEP:
            return {
                ...state,
                nghenghiepList: payload?.result,
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