import { FETCH_BAOCAOCHITIETKETQUASOHOAMAU1 } from 'store/actions'
import { AppAction, BaoCaoChiTietKetQuaSoHoaMau1State } from 'store/interface'

const baocaochitietketquasohoamau1State: BaoCaoChiTietKetQuaSoHoaMau1State = {}

export default function baocaochitietketquasohoamau1Reducer(
    state = baocaochitietketquasohoamau1State,
    action: AppAction
): BaoCaoChiTietKetQuaSoHoaMau1State {
    const { type, payload } = action
    switch (type) {
        case FETCH_BAOCAOCHITIETKETQUASOHOAMAU1:
            return {
                ...state,
                baocaochitietketquasohoamau1List: payload?.data
            }
        default:
            break
    }
    return state
}
