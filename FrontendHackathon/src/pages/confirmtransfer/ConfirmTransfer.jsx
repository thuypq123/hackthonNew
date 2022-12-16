import React from 'react'
import "./confirmTransfer.css"
import  { useNavigate  } from 'react-router-dom'

function ConfirmTransfer() {

    const toAcc = sessionStorage.getItem("toAcc")
    const amount = sessionStorage.getItem("amount")
    const description = sessionStorage.getItem("description")
    const navigate = useNavigate();
    if(!toAcc || !amount || !description) {
        navigate("/");
    }
    const deleteSession = () => {
        sessionStorage.removeItem("toAcc")
        sessionStorage.removeItem("amount")
        sessionStorage.removeItem("description")
    }

    const confirm = () => {
        //chuyen ve trang chu
        deleteSession()
        navigate("/home");
    }

    const newTransfer = () => {
        //chuyen sang tao giao dich moi
        deleteSession()
        navigate("/checktransfer");
    }

    return (
        <div className='transferPage'>   
            <div className='transferContainer'>
                <div className='transferWraper'>
                    <h2>Bạn đã chuyển khoản thành công</h2>
                    <form>
                        <div className='transferStyleInput'>
                            <label>Số tài khoản người nhận: {toAcc}</label>
                        </div>
                        <div className='transferStyleInput'>
                            <label>Số tiền chuyển khoản: {amount}</label>
                        </div>
                        <div className='transferStyleInput'>
                            <label>Lời nhắn:</label>
                            <textarea readOnly type="text" name="description" id="description" value={description} />
                        </div>

                        <div className='transferSubmit'>
                            <button type="button" onClick={confirm} className='btnButton btnTransfer'>Xác nhận</button>
                            <button type="button" onClick={newTransfer} className='btnButton btnTransfer'>Tạo giao dịch mới</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmTransfer