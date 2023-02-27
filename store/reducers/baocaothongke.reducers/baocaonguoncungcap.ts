import { FETCH_BAOCAONGUONCUNGCAP } from 'store/actions'
import { AppAction, BaoCaoNguonCungCapState } from 'store/interface'

const baocaonguoncungcapState: BaoCaoNguonCungCapState = {}

export default function baocaonguoncungcapReducer(
    state = baocaonguoncungcapState,
    action: AppAction
): BaoCaoNguonCungCapState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAONGUONCUNGCAP:
            return {
                ...state,
                baocaonguoncungcapList: payload?.data?.items,
                totalRecords: payload?.data?.pagination?.total,
                currentPage: payload?.data?.pagination?.currentPage,
                pageSize: payload?.pageSize ?? 10,
                searchData: payload?.searchData,
                idDonvi: payload?.idDonvi
            }
        default:
            break
    }
    return state
}
