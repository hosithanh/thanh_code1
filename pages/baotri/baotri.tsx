import Logo from 'assets/image/logo-cantho.png';
import { Link } from "react-router-dom";
const BaoTri = (): JSX.Element => {
    return (
        <>
            <header id="header">
                <div id="logo">
                    <Link to={'/thong-ke-so-hoa'} className="header-logo">
                        <img src={Logo} alt="logo_cantho" />
                        <span>KHO SỐ HÓA KẾT QUẢ GIẢI QUYẾT TTHC TP CẦN THƠ</span>
                    </Link>
                </div>
            </header>
            <div className='content-warpper'>
                <h1 style={{ position: 'fixed', color: 'red', top: '40%', width:'100%', textAlign: 'center' }}>HỆ THỐNG ĐANG BẢO TRÌ!</h1>
            </div>
        </>

    )
}

export default BaoTri