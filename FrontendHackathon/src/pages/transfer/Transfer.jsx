import React from 'react'
import "./transfer.css"
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Transfer() {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    const milliseconds = new Date();
    const [fromAcc, setFromAcc] = useState("");
    const [toAcc, setToAcc] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [modaltitle, setModalTitle] = useState("");
    const [errorAcct, setErrorAcct] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:3000/transfer";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(toAcc.length <6 || toAcc.length>15) {
            setErrorAcct("Số tài khoản trong khoảng từ 6 đến 15 ký tự!!!");
        }else if(description.length >= 151) {
            setErrorDescription("Lời nhắn không dài quá 150 ký tự!!!")
        } else {
            const values = {
                data: {
                    fromAcc: fromAcc,
                    toAcc: toAcc,
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
                    console.log(res)
                    if( res.data.responseCode === '00'){
                        //thanh cong
                        sessionStorage.setItem("toAcc", toAcc);
                        sessionStorage.setItem("amount", amount);
                        sessionStorage.setItem("description", description);
                        navigate("/verify_transfer");
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
        <div className='transferPage'>   
            <div className='transferContainer'>
                <div className='transferWraper'>
                    <h2>Chức năng chuyển khoản</h2>
                    <span className='textErrorMsg'>{modaltitle}</span>
                    <form onSubmit={handleSubmit}>
                        <div className='transferStyleInput'>
                            <label>Số tài khoản người nhận</label>
                            <input type="number" name="accountid" id="accountid" required
                                onChange={(e) => setToAcc(e.target.value)} 
                                onBlur = {(e) => {
                                    if(e.target.value.length <6 || e.target.value.length>15) {
                                        setErrorAcct("Số tài khoản trong khoảng từ 6 đến 15 ký tự!!!");
                                    } else
                                        setErrorAcct("");
                                }} />
                        </div>
                        <div className='transferStyleInput'>
                            <label>Số tiền chuyển khoản</label>
                            <input type="number" name="amount" id="amount" required
                                onChange={(e) => setAmount(e.target.value)} />
                        </div>

                        <div className='transferStyleInput'>
                            <label>Lời nhắn</label>
                            <textarea type="text" name="description" id="description" required
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={e => {
                                    if (e.target.value.length >= 151)
                                        setErrorDescription("Lời nhắn không dài quá 150 ký tự!!!")
                                    else
                                        setErrorDescription("")
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
    )
}

export default Transfer;