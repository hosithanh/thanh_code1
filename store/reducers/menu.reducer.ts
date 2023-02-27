import { FETCH_MENU } from '../actions'
import { AppAction, MenuState } from '../interface'

const menuState: MenuState = {}

export default function userReducer(state = menuState, action: AppAction): MenuState {
    switch (action.type) {
        case FETCH_MENU:
            return {
                ...state,
                menuList: action.payload.data?.items,
                totalRecords: action.payload.data?.pagination?.total,
                currentPage: action.payload.data?.pagination?.currentPage,
                pageSize: action.payload.data?.pagination?.pageSize
            }
        default:
            break
    }
    return state
}
