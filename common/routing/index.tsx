import NoMatch from 'common/component/layout/NoMatch'
import { MenuPermission } from 'common/interface/MenuPermission'
import { isArrayEmpty } from 'common/utils/empty-util'
import BaoTri from 'pages/baotri/baotri'
import Dangnhap from 'pages/dangnhap/Dangnhap'
import DonViPublic from 'pages/dashboard_public/DonViPublic'
import ThongKeSoHoa from 'pages/dashboard_public/ThongKeSoHoa'
import KetQua from 'pages/tichhopdulieu/KetQua'
import XemTepKySo from 'pages/tichhopdulieu/XemTepKySo'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { AppState } from 'store/interface'
import { routes } from './routes'

export default function AppRouting(): JSX.Element {
    const menuPermission = useSelector<AppState, MenuPermission[] | undefined>(
        (state) => state.permission.menuPermission
    )
    const routePermission = menuPermission?.reduce((prev: any, curr) => {
        if (isArrayEmpty(curr.children)) {
            prev.push(curr.url)
            return prev
        } else {
            curr.children?.map((item) => {
                prev.push(item.url)
                return prev
            })
        }
        return prev
    }, [])

    return (
        <Switch>
            {routes
                .filter((route) => routePermission?.some((path) => path === `/${route.path.split('/')[1]}`))
                .map((route, index) => (
                    <Route key={index} exact path={route.path} component={route.component} />
                ))}
            <Route path="*">
                <NoMatch />
            </Route>
        </Switch>
    )
}

export function UnauthorizeRouting({ setPathPublic }): JSX.Element {
    return (
        <Switch>
            <Route path='/thong-ke-so-hoa' render={(props) => <ThongKeSoHoa setPathPublic={setPathPublic} />} />
            <Route path='/thong-ke-so-hoa-don-vi/:id' render={(props) => <DonViPublic setPathPublic={setPathPublic} {...props} />} />
            <Route path='/bao-tri-he-thong' component={BaoTri} />
            <Route path='/dangnhap' component={Dangnhap} />
            <Route path='/dulieu/iframe/:ketqua' component={KetQua} />
            <Route path='/xemkyso' component={XemTepKySo} />
        </Switch>
    )
}
