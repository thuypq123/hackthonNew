import React from 'react'
import "./payment.css"
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import swal from "sweetalert";

function Payment() {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    const milliseconds = new Date();
    const [sdId, setSdId] = useState(sessionStorage.getItem("sdId")?sessionStorage.getItem("sdId"):"");
    const [amount, setAmount] = useState(sessionStorage.getItem("amountHP")?sessionStorage.getItem("amountHP"):"");
    const [description, setDescription] = useState(sessionStorage.getItem("descriptionHP")?sessionStorage.getItem("descriptionHP"):"");
    const [errorDescription, setErrorDescription] = useState("");
    const [modaltitle, setModalTitle] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:3000/payment";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(description.length >= 151) {
            setErrorDescription("Lời nhắn không dài quá 150 ký tự!!!");
        } else {
            const values = {
                data: {
                    sdId: sdId,
                    amount: amount,
                    description: description,
                    token: Cookies.get('token'),
                },
                request: {
                    requestId: uuidv4(),
                    requestTime: milliseconds.getTime(),
                }
            }
    
            axios.post(url, JSON.stringify(values), config)
                .then(res => {
                    console.log(res.data.responseCode)
                    if( res.data.responseCode === '00'){
                        //thanh cong
                        sessionStorage.setItem("sdId", sdId);
                        sessionStorage.setItem("amountHP", amount);
                        sessionStorage.setItem("descriptionHP", description);
                        navigate("/verify_payment");
                    } else {
                        //that bai
                        setModalTitle("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                    }  
                })
                .catch(error => {
                    setModalTitle("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                    console.log(error);
                })
        }
        
    }
    return (
        <>
            <div className='transferPage'>
                <div className='transferContainer'>
                    <div className='transferWraper'>
                        <h2>Thanh toán học phí</h2>
                        <span className='textErrorMsg'>{modaltitle}</span>
                        <form onSubmit={handleSubmit}>
                            <div className='transferStyleInput'>
                                <label>Mã số sinh viên</label>
                                <input type="text" name="acctid" id="acctid" required
                                    onChange={(e) => setSdId(e.target.value)} value={sdId}/>
                            </div>
                            <div className='transferStyleInput'>
                                <label>Số tiền đóng</label>
                                <input type="number" name="amount" id="amount" required
                                    onChange={(e) => setAmount(e.target.value)} value={amount}/>
                            </div>
                            <div className='transferStyleInput'>
                                <label>Lời nhắn</label>
                                <textarea type="text" name="description" id="description" required
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    onBlur={e => {
                                        if (e.target.value.length >= 151)
                                            setErrorDescription("Lời nhắn không dài quá 150 ký tự!!!");
                                        else
                                            setErrorDescription("");
                                    }} />
                                <span className='textErrorMsg'>{errorDescription}</span>
                            </div>

                            <div className='transferSubmit'>
                                <button type="submit" className='btnButton btnTransfer'>Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Payment