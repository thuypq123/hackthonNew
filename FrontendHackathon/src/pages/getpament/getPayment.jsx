import React from "react";
import "./getPayment.css";
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from "js-cookie";
import swal from "sweetalert";
import userImage from "../../Images/user.png"

function GetPayment({inSystem, type}) {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    const milliseconds = new Date();
    const [sdId, setSdId] = useState("");
    const [payMents, setPayMents] = useState([]);
    const [error, setError] = useState("");
    const url = "http://localhost:3000/Get_payment";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = {
            data: {
                sdId: sdId,
                token: Cookies.get("token"),
                inSystem: inSystem,
            },
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        }
        await axios.post(url, JSON.stringify(values), config)
            .then(res => {
                console.log(res.data.data);
                if (res.data.response.responseCode === "00") {
                    setPayMents(res.data.data.listPayment);
                } else {
                    setError("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                }
            })
            .catch(error => {
                setError("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                console.log(error);
            })
    }
    return (
        <div className='transferHisPage'>
            <div className='transferHisContainer'>
                <div className='transferHisWrapper'>
                    <h2>{type}</h2>
                    <span className='textErrorMsg'>{error}</span>
                    <form onSubmit={handleSubmit} className="transferForm">
                        <div className='transferStyleInput'>
                            <label>Mã số sinh viên</label>
                            <input type="text" name="acctid" id="acctid" required
                                onChange={(e) => setSdId(e.target.value)} />
                        </div>
                        <div className='transferStyleInput'>
                            <button type="submit" className='btnButton btnTransfer'>Truy vấn</button>
                        </div>
                    </form>
                </div>
                <div className='transferWrapperResult '>
                    <div className="transFerResult">   
                        {payMents.length>0 && payMents.map((item, index) => {
                            return <div className="transFerResultCard" key={index}>
                                <img
                                    src={userImage}
                                    style={{ width: '50px', height: '50px' }}
                                    className='resultImg'
                                />
                                <div className="transFerResultItem">
                                    <span>{item.fee}</span>
                                    <span>{item.description}</span>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GetPayment;