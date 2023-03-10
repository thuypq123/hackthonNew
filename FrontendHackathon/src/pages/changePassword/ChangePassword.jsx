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
                        title: "Vui lo??ng nh????p ????ng th??ng tin",
                        icon: "error",
                        button: "OK",
                    })
                }
        }else{
            swal({
                title: "Vui lo??ng nh????p ??????y ??u?? th??ng tin",
                icon: "error",
                button: "OK",
            })
        }
    }
    const passwordValidator = () => {
        console.log(passwordChange.current.value)
        if (!passwordChange.current.value) {
            setErrPassword('M????t kh????u la?? b????t bu????c*.')
        } else if (regexPassword.test(passwordChange.current.value)) {
            if (passwordChange.current.value.indexOf('password') !== -1) {
                setErrPassword('M????t kh????u kh??ng ????????c ch??a ch???? password')
            } else {
                setErrPassword("")
            }
        } else {
            setErrPassword('M???t kh???u t???i thi???u 8 k?? t??? & ph???i c?? ch??? th?????ng, ch??? hoa v?? s???, cho ph??p c??c k?? t??? ?????c bi???t, ngo???i tr??? "^" "$"');
        }
    }

    const checkPassword = () =>
        checkPasswordChange.current.value === passwordChange.current.value ? setCheckErrPassword("")
            : setCheckErrPassword("M????t kh????u kh??ng kh????p.")

    return (
        <div>
            <div className='changePasswordPage'>
                <div className="changePasswordContainer">
                    <img src="" alt="" className='changePasswordPanner' />
                    <div className="changePasswordWrapper">
                        <h2>Thay ??????i m????t kh????u</h2>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='Nh????p password hi????n ta??i' className='changePasswordTextInput'
                                ref={passwordCur} />
                        </div>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='M????t kh????u m????i' className='changePasswordTextInput'
                                ref={passwordChange} onBlur={() => passwordValidator()} />
                        </div>
                        <span className='checkPasswordMess'>{ErrPassword}</span>
                        <div className="changePasswordStyleInput">
                            <input type="password" placeholder='Xa??c nh????n m????t kh????u m????i' className='changePasswordTextInput'
                                ref={checkPasswordChange} onBlur={() => checkPassword()} />
                        </div>

                        <span className='checkPasswordMess'>{checkErrPassword}</span>

                        <button className='btnButton btnConfirm' onClick={handleSubmit}>Xa??c nh????n</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
