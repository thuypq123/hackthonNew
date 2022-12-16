import React from "react";
import "./transferHistory.css";
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from "js-cookie";
import swal from "sweetalert";
import userImage from "../../Images/user.png"

function TransferHistory() {
    if(!Cookies.get('token')) {
        window.location.href = "/login";
    }
    const milliseconds = new Date();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [error, setError] = useState("");
    const [errorAcct, setErrorAcct] = useState("");
    const [tranHis, setTranHis] = useState();

    const url = "http://localhost:3000/tranhis";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFromDate = moment(fromDate).format("DD-MM-YYYY");
        const newToDate = moment(toDate).format("DD-MM-YYYY");
        console.log(newFromDate, newToDate);
        const values = {
            data: {
                fromDate: newFromDate,
                toDate: newToDate,
                inSystem: true,
                token: Cookies.get("token"),
            },
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        }
        await axios.post(url, JSON.stringify(values), config)
            .then(res => {
                if (res.data.responseCode === "00") {
                    if(res.data.data.transHis.length === 0){
                        swal("Thông báo", "Không có giao dịch nào trong khoảng thời gian bạn chọn!", "warning");
                    }
                    setTranHis(res.data.data.transHis);
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
                    <h2>Liệt kê các giao dịch ngân hàng điện tử</h2>
                    <span className='textErrorMsg'>{error}</span>
                    <form onSubmit={handleSubmit} className="transferForm">
                        <div className='transferStyleInput'>
                            <label>Từ ngày</label>
                            <input type="date" name="fromdate" id="fromdate" required
                                onChange={(e) => setFromDate(e.target.value)} />
                        </div>

                        <div className='transferStyleInput'>
                            <label>Lời nhắn</label>
                            <input type="date" name="todate" id="todate" required
                                onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <div className='transferStyleInput'>
                            <button type="submit" className='btnButton btnTransfer'>Truy vấn</button>
                        </div>
                    </form>
                </div>
                <div className='transferWrapperResult '>
                    <h2 className="headerTransferWrapperResult">Lịch sử giao dịch... </h2>
                    <div className="transFerResult">
                        
                        {tranHis && tranHis.map((item, index) => {
                            return <div className="transFerResultCard" key={index}>
                                <img
                                    src={userImage}

                                    className='resultImg'
                                />
                                <div className="transFerResultItem">
                                    <span>{item.accountNo}</span>
                                    <span>{item.amount}</span>
                                    <span>{item.toAccNo}</span>
                                    <span>{item.description}</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        })}

                    </div>


                </div>
            </div>

        </div>
    )
}

export default TransferHistory;