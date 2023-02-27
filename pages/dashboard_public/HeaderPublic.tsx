import Logo from 'assets/image/logo-cantho.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from 'store/interface';
function HeaderPublic({ setPathPublic }) {
    const accessToken = useSelector<AppState, boolean | undefined>(state => state.auth.accessToken)
    return (
        <header id="header">
            <div id="logo">
                <Link to={'/thong-ke-so-hoa'} className="header-logo">
                    <img src={Logo} alt="logo_cantho" />
                    <span>KHO SỐ HÓA KẾT QUẢ GIẢI QUYẾT TTHC TP CẦN THƠ</span>
                </Link>
            </div>
            <div id="login">
                {
                    !accessToken ?
                        <Link to={'/dangnhap'}>
                            <button>ĐĂNG NHẬP</button>
                        </Link> :
                        <Link to={'/'}>
                            <button style={{ border: 'none' }} onClick={() => setPathPublic(false)}>
                                <i className="fa fa-home" style={{ fontSize: '22px' }} /> TRANG CHỦ
                            </button>
                        </Link>
                }
            </div>
        </header>
    )
}

export default HeaderPublic