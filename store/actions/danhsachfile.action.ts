import axios from 'axios'
import { Notification } from 'common/component/notification'
import { FILES } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { GetFiles } from 'store/interface'
import { FETCH_FILES } from '.'

export const getFiles =
    ({ page, pageSize, from, dataSearch, sortData, to }: GetFiles) =>
    (dispatch) => {
        return axios
            .get(
                `${FILES}/?curPage=${page ?? 1}&&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(dataSearch) ? `&searchData=${dataSearch}` : ''
                }${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_FILES,
                    payload: { ...res.data, dataSearch, pageSize }
                })
            })
            .catch((error) => {
                Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
            })
    }
//{ curPage, pageSize, from, searchData, sortData, to }: GetFiles
