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
function CheckOtpCode({user}) {
  if(!Cookies.get('token')) {
    window.location.href = "/login";
  }
    var params = window.location.pathname;
    params = params.split("/")[1];
    const url = "http://localhost:3000/"+params;
    const otpRef=  useRef();
    let location = useLocation();
    const [emailOtpCheck, setEmailOtpCheck] = useState();
    const [data, setData] = useState();
    useEffect(() => {
        if(location.state){
          setEmailOtpCheck(location.state.data);
        }else{
          setData(JSON.parse(Cookies.get('data')));
          console.log(data)
        }
    }, []);
    const handleSubmit = (e) => {
      const config = {  
        "headers": {  
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
        e.preventDefault();
        if(params === "verify_user" || params === "verify_login"){
          var json = JSON.stringify({ email: emailOtpCheck, OTP: otpRef.current.value })
        }else if(params === "verify_change_password"){
          data.data.OTP = otpRef.current.value;
          var json = JSON.stringify(data)
        }
        axios.post(url, json, config)
        .then(res => {
          console.log("Posting data", res)
          if(res.data.response.responseCode === "00"){
            if(params === "verify_user"){
              window.location.replace("/login")
            }else if(params === "verify_login"){
              console.log(res.data);
              Cookies.set('token', res.data.token);
              window.location.replace("/")
            }else if(params === "verify_change_password"){
              if(res.data.response.responseCode === "00"){
                swal({
                  title: "Tha??nh c??ng",
                  text: "??????i m????t kh????u tha??nh c??ng",
                  icon: "success",
                  button: "OK",
                }).then(() => {
                  window.location.replace("/")
                });
              }
            }
          }else{
            alert("OTP kh??ng ??u??ng")
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
                    <h2>Nh????p ma?? OTP ma?? chu??ng t??i ??a?? g????i t????i email {emailOtpCheck} ?????? xa??c nh????n ????ng ky??</h2>
                    <div className="checkOtpStyleInput"> 
                        <input type="number" placeholder='Nh????p ma?? OTP ta??i ????y' className='checkOtpTextInput' 
                        onInput={(e) => e.target.value = e.target.value.slice(0, 6)}
                        ref={otpRef}/>
                    </div>
                   
                     <button  className='btnButton btnConfirm' onClick={handleSubmit}>Xa??c nh????n</button>             
                </div> 
            </div>
        </div>
    </div>
  )
}

export default CheckOtpCode
