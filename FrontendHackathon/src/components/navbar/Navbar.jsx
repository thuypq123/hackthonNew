import React from 'react'
import { useState } from 'react';
import userImage from "../../Images/userImage.png"
import logo from "../../Images/LogoHDBank.png"
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import "./navbar.css"
import Cookies from 'js-cookie';
function Navbar({user}) {
    const [open, setOpen] = useState(false);
    const menuUserSetting = ["Thay đổi mật khẩu", "Thoát"]
    console.log(user)
    return (
        <div className="navbar">
            <div className="navContainer">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logoNavbar" />
                </Link>


                {Cookies.get('token') ? (

                    <>
                        <div className='navBarOption'>
                            <ul className='navBarOptionUl'>
                                <li><Link to="/transfer" className="link hover"> Chuyển khoản</Link></li>
                                <li><Link to="/transferHistory" className="link hover"> Lịch sử giao dịch</Link></li>
                                <li><Link to="/payment" className="link hover"> Thanh toán học phí</Link></li>
                                <li><Link to="/getpayment" className="link hover"> Danh sách học phí</Link></li>
                                <li><Link to="/paymentHis" className="link hover">lich su học phí</Link></li>
                            </ul>
                        </div>
                        <div className="navbarUser">
                            <div>
                                <div onClick={() => setOpen(!open)} >
                                    <Link to="/" className='link navBarInfo'>
                                        <img
                                            src={userImage}
                                            alt=""
                                            className="navBarImgUser"
                                        />
                                        <span>{user.fullName} - </span>
                                        <span>{user.amount} VND</span>
                                    </Link>
                                </div>

                                {open &&
                                    <div className='userChoses'>
                                        <ul className='userChosesStyle'>
                                            <li onClick={() => setOpen(!open)}><Link to="/change_password" className='link hover'>Thay đổi mật khẩu</Link></li>
                                            <li onClick={() => setOpen(!open)}><Link to="" className='link hover'>Thoat</Link></li>
                                        </ul>

                                    </div>}
                            </div>

                        </div>
                    </>

                ) : (
                    <div className="navItems">
                        <Link className="link" to="/login">

                            <button className="btnButton btnDN">Đăng nhập</button>
                        </Link>
                        <Link className="link" to="/register">
                            <button className="btnButton btnDK">Đăng ký</button>
                        </Link>

                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar
