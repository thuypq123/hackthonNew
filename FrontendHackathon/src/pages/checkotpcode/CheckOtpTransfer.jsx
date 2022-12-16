import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './checkOtpCode.css';
import swal from 'sweetalert';
function CheckOtpTransfer({user}) {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    var params = window.location.pathname;
    params = params.split("/")[1];
    const url = "http://localhost:3000/"+params;
    const otpRef=  useRef();
    let location = useLocation();
    const handleSubmit = (e) => {
      const config = {  
        "headers": {  
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    const toAcc = sessionStorage.getItem("toAcc")
    const amount = sessionStorage.getItem("amount")
    const description = sessionStorage.getItem("description")
    const token = Cookies.get('token')
    const json = JSON.stringify({ toAcct: toAcc, amount: amount, description: description, token: token, OTP: otpRef.current.value })
        e.preventDefault();
        axios.post(url, json, config)
        .then(res => {
            if(res.data.response.responseCode === "00"){
                swal({
                    title: "Thành công",
                    text: "Chuyển tiền thành công",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    window.location.replace("/confirm_transfer")
                });
            }
        }).catch(error => console.log(error))
        console.log(json)
    }


  return (
    <div>
      <div className='checkOtpPage'>
            <div className="checkOtpContainer">
                <img src="" alt="" className='checkOtpPanner' />
                <div className="checkOtpWrapper">
                    <h2>Nhập mã OTP mà chúng tôi đã gởi tới email {} để xác nhận đăng ký</h2>
                    <div className="checkOtpStyleInput"> 
                        <input type="number" placeholder='Nhập mã OTP tại đây' className='checkOtpTextInput' 
                        onInput={(e) => e.target.value = e.target.value.slice(0, 6)}
                        ref={otpRef}/>
                    </div>
                   
                     <button  className='btnButton btnConfirm' onClick={handleSubmit}>Xác nhận</button>             
                </div> 
            </div>
        </div>
    </div>
  )
}

export default CheckOtpTransfer
