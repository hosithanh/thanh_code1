import { FECTH_PERMISSION_FAIL, FECTH_PERMISSION_SUCCESS } from '../actions'
import { AppAction, PermissionState } from '../interface'

const appState: PermissionState = { menuPermission: [] }

export default function permissionReducer(state = appState, action: AppAction): PermissionState {
    switch (action.type) {
        case FECTH_PERMISSION_SUCCESS:
            return { ...state, menuPermission: action.payload }
        case FECTH_PERMISSION_FAIL:
            return { ...state, menuPermission: [] }
        default:
            break
    }
    return state
}
