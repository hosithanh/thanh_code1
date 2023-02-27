import { FETCH_BAOCAOLOAIKETQUA } from 'store/actions'
import { AppAction, BaoCaoLoaiKetQuaState } from 'store/interface'

const baocaoloaiketquaState: BaoCaoLoaiKetQuaState = {}

export default function baocaoloaiketquaReducer(
    state = baocaoloaiketquaState,
    action: AppAction
): BaoCaoLoaiKetQuaState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAOLOAIKETQUA:
            return {
                ...state,
                baocaoloaiketquaList: payload?.items,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pageSize ?? 10,
                searchData: payload?.searchData,
                idDonvi: payload?.idDonvi
            }
        default:
            break
    }
    return state
}
