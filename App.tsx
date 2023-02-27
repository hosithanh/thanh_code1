import axios from 'axios'
import { BAO_TRI_HE_THONG_URL } from 'common/constant/api-constant'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import AppLayout from './common/component/layout'
import { UnauthorizeRouting } from './common/routing'
import { AppState } from './store/interface'

export default function App(): JSX.Element {
    const history = useHistory()
    const accessToken = useSelector<AppState, boolean | undefined>((state) => state.auth.accessToken)

    const [pathPublic, setPathPublic] = useState(false)
    const [isBaoTri, setIsBaoTri] = useState<boolean>(false)

    useEffect(() => {
        axios
            .get(`${BAO_TRI_HE_THONG_URL}`)
            .then((res) => {
                setIsBaoTri(res.data.data)
            })
            .catch((err) => {
                setIsBaoTri(true)
            })
        if (isBaoTri) {
            history.push('/bao-tri-he-thong')
            setPathPublic(true)
        } else {
            if (!accessToken) {
                if (
                    window.location.pathname.includes('/dulieu/iframe') ||
                    window.location.pathname.includes('/xemkyso')
                ) {
                    history.push(window.location.pathname + window.location.search)
                } else if (window.location.pathname.includes('/dangnhap')) {
                    history.push('/dangnhap')
                } else if (window.location.pathname.includes('/thong-ke-so-hoa-don-vi')) {
                    history.push(window.location.pathname + window.location.search)
                } else {
                    history.push('/thong-ke-so-hoa')
                    setPathPublic(true)
                }
            } else {
                if (window.location.pathname.includes('/thong-ke-so-hoa-don-vi')) {
                    history.push(window.location.pathname + window.location.search)
                    setPathPublic(true)
                } else if (window.location.pathname.includes('/thong-ke-so-hoa')) {
                    history.push('/thong-ke-so-hoa')
                    setPathPublic(true)
                } else if (window.location.pathname.includes('/dangnhap')) {
                    setPathPublic(false)
                    history.push('/')
                } else if (
                    window.location.pathname.includes('/dulieu/iframe') ||
                    window.location.pathname.includes('/xemkyso')
                ) {
                    setPathPublic(true)
                    history.push(window.location.pathname + window.location.search)
                }
            }
        }
    }, [accessToken, history, pathPublic, isBaoTri])
    return accessToken && !pathPublic && !isBaoTri ? (
        <AppLayout />
    ) : (
        <UnauthorizeRouting setPathPublic={setPathPublic} />
    )
}
