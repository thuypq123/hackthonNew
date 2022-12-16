import React from 'react'
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Getkey } from '../../getkey.js';
import { stringify, v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { JSEncrypt } from "jsencrypt";
import Navbar from '../../components/navbar/Navbar';
import './changepassword.css'
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import { Navigate } from 'react-router-dom';


function ChangePassword({user}) {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    const url = "http://localhost:3000/change_password";
    const milliseconds = new Date();
    const passwordCur = useRef();
    const passwordChange = useRef();
    const checkPasswordChange = useRef();
    const [getKey, setGetKey] = useState("")
    const [ErrPassword, setErrPassword] = useState("")
    const [checkErrPassword, setCheckErrPassword] = useState("")
    const token = Cookies.get('token')
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!%*#?&]{8,}$/;
    let config = {
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
        }
    }
    // Ma hoa RSA 
    var encrypt = new JSEncrypt();
    const encrypted = (userName, password, passwordChange) => {
        encrypt.setPublicKey(getKey)
        var json = JSON.stringify({ username: userName, oldPass: password, newPass: passwordChange })
        var encrypted = encrypt.encrypt(json);
        return encrypted;
    }


    // Get key
    useEffect(() => {
        Getkey().then(data => setGetKey(data))
    }, []);
    // Get 
    const handleSubmit = (e) => {
        e.preventDefault();
        const data =  {
            credential: encrypted(user.username,passwordCur.current.value, passwordChange.current.value),
            key: getKey,
            oldPass: passwordCur.current.value,
            newPass: passwordChange.current.value,
            token: token,
            username: user.username
        };
        var json = JSON.stringify({
            data,
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        })
        if(passwordCur.current.value!=="" || passwordChange.current.value!=="" || checkPasswordChange.current.value!==""){
            if(ErrPassword===""||checkErrPassword===""){
                axios.post(url, json, config)
                    .then( res => {
                        console.log("Posting data", res)
                        if(res.data.responseCode === "00"){
                            swal({
                                title: res.data.message,
                                icon: "success",
                                button: "OK",
                            }).then(() => {
                                window.location.replace("/verify_change_password")
                                Cookies.set('data', JSON.stringify({data}));
                            })
                        console.log(res.data)
                    }else{
                        swal({
                            title: res.data.message,
                            icon: "error",
                            button: "OK",
                        })
                    }
                    }).catch(error => console.log(error))
                }else{
                    swal({
                        title: "Vui lòng nhập đúng thông tin",
                        icon: "error",
                        button: "OK",
                    })
                }
        }else{
            swal({
                title: "Vui lòng nhập đầy đủ thông tin",
                icon: "error",
                button: "OK",
            })
        }
    }
    const passwordValidator = () => {
        console.log(passwordChange.current.value)
        if (!passwordChange.current.value) {
            setErrPassword('Mật khẩu là bắt buộc*.')
        } else if (regexPassword.test(passwordChange.current.value)) {
            if (passwordChange.current.value.indexOf('password') !== -1) {
                setErrPassword('Mật khẩu không được chưa chữ password')
            } else {
                setErrPassword("")
            }
        } else {
            setErrPassword('Mật khẩu tối thiểu 8 ký tự & phải có chữ thường, chữ hoa và số, cho phép các ký tự đặc biệt, ngoại trừ "^" "$"');
        }
    }

    const checkPassword = () =>
        checkPasswordChange.current.value === passwordChange.current.value ? setCheckErrPassword("")
            : setCheckErrPassword("Mật khẩu không khớp.")

    return (
        <div>
            <div className='changePasswordPage'>
                <div className="changePasswordContainer">
                    <img src="" alt="" className='changePasswordPanner' />
                    <div className="changePasswordWrapper">
                        <h2>Thay đổi mật khẩu</h2>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='Nhập password hiện tại' className='changePasswordTextInput'
                                ref={passwordCur} />
                        </div>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='Mật khẩu mới' className='changePasswordTextInput'
                                ref={passwordChange} onBlur={() => passwordValidator()} />
                        </div>
                        <span className='checkPasswordMess'>{ErrPassword}</span>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='Xác nhận mật khẩu mới' className='changePasswordTextInput'
                                ref={checkPasswordChange} onBlur={() => checkPassword()} />
                        </div>

                        <span className='checkPasswordMess'>{checkErrPassword}</span>

                        <button className='btnButton btnConfirm' onClick={handleSubmit}>Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
