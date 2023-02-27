import { FETCH_BAOCAONGUONKHAITHAC } from 'store/actions'
import { AppAction, BaoCaoNguonKhaiThacState } from 'store/interface'

const baocaonguonkhaithacState: BaoCaoNguonKhaiThacState = {}

export default function baocaonguonkhaithacReducer(
    state = baocaonguonkhaithacState,
    action: AppAction
): BaoCaoNguonKhaiThacState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAONGUONKHAITHAC:
            return {
                ...state,
                baocaonguonkhaithacList: payload?.data?.items,
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
