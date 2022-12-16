import React, { useState } from 'react'
import "./login.css"
import loginPanner from "../../Images/loginPanner.jpg"
import { Getkey } from '../../getkey.js';
import { BsFillPersonFill } from "react-icons/bs";

import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { JSEncrypt } from "jsencrypt";
import { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState({});
    const [getKey, setGetKey] = useState("")
    const [emailOTP, setEmailOTP] = useState()
    const navigate = useNavigate();

    const milliseconds = new Date();

    const url = "http://localhost:3000/login";
    //ma hoa
    var encrypt = new JSEncrypt();
    let config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    //getKey
    useEffect(() => {
        Getkey().then(data => setGetKey(data))
    }, []);
    //
    const encrypted = (userName, Password) => {
        encrypt.setPublicKey(getKey)
        var json = JSON.stringify({ username: userName, password: Password })
        var encrypted = encrypt.encrypt(json);
        return encrypted;
    }
    // Set data 
    useEffect(() => {
        setData({
            data: {
                credential: encrypted(userName, password),
                key: getKey,
                username: userName,
                password: password
            },
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        })
    }, [userName, password])
    //post data

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        if (userName !== "" || password !== "") {
            axios.post(url, JSON.stringify(data), config)
                .then(res => {
                    console.log(res)
                    if (res.data.responseCode === "00") {
                        const getEmail = res.data.email;
                        console.log(getEmail)
                        window.location.replace("/verify_login")
                        navigate("/verify_login", { state: { data: getEmail } });
                    } else {
                        alert(res.data.responseMessage)
                    }
                }
                ).catch(error => console.log(error))
        }

    }

    return (
        <div className='loginPage'>
            <div className="loginContainer">
                <img src={loginPanner} alt="" className='loginPanner' />
                <div className="loginWrapper">
                    <h2>Đăng nhập eBanking</h2>
                    <div className="loginStyleInput">
                        <BsFillPersonFill className='loginIcon' />
                        <input type="text" onChange={(e) => setUserName(e.target.value)} className='loginTextInput' />
                    </div>
                    <div className="loginStyleInput">
                        <FaLock className='loginIcon' />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} className='loginTextInput' />
                    </div>
                    <button onClick={handleSubmit} className='btnButton btnLgDN'>Đăng Nhập</button>

                    <Link className="link" to="/register">
                        <button className='btnButton btnLgTTk'> Tạo Tài Khoản Ngay</button>
                    </Link>

                    <span className='btnKhongDN'>Bạn không thể đăng nhập?</span>
                </div>

            </div>
        </div>
    )
}

export default Login
