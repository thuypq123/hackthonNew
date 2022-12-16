import React from 'react'
import "./checktransfer.css"
import { AiOutlineSearch } from "react-icons/ai";
import { IoAddSharp } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
function CheckTransfer() {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    return (
        <>
            <div className='checkTransferPage'>
                <div className='checkTransferContainer'>
                    <div className='checkTransferWraper'>
                        <h2>Bạn muốn chuyển khoản tới ...</h2>
                        <h4>Chọn liên hệ</h4>
                        <div className='checkTransferAddNew'>
                            <Link to="/transfer" className='link'><IoAddSharp className='icon circle' /><span>Người nhận mới ...</span></Link>
                        </div>
                        <div className='checkTransferSearch'>
                            <button ><AiOutlineSearch className='icon' /></button>
                            <input type="text" name="search" id="search" placeholder='Tìm người nhận đã lưu' />
                        </div>
                        {/* Danh sách người nhận đã lưu */}
                        <div className='checkTransferResult'>
                            <ul>
                                <li><FiUser className='icon' /><Link to="#" className='link'>DAO NGUYEN NGOC DUC</Link></li>
                                <li><FiUser className='icon' /><Link to="#" className='link'>DAO NGUYEN NGOC DUC</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CheckTransfer