import { FETCH_BAOCAOSUDUNGDICHVU } from 'store/actions'
import { AppAction, BaoCaoSuDungDichVuState } from 'store/interface'

const baocaosudungdichvuState: BaoCaoSuDungDichVuState = {}

export default function baocaosudungdichvuReducer(
    state = baocaosudungdichvuState,
    action: AppAction
): BaoCaoSuDungDichVuState {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAOSUDUNGDICHVU:
            return {
                ...state,
                baocaosudungdichvuList: payload?.data
            }
        default:
            break
    }
    return state
}
