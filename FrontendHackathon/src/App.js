import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import '@progress/kendo-theme-default/dist/all.css';
import Register from "./pages/register/MainRegister";
import Navbar from  "./components/navbar/Navbar"
import Footer from "./components/footer/Footer";
import CheckTransfer from "./pages/checktransfer/CheckTransfer";
import Transfer from "./pages/transfer/Transfer";
import CheckOtpCode from "./pages/checkotpcode/CheckOtpCode";
import ChangePassword from "./pages/changePassword/ChangePassword";
import TransferHistory from "./pages/transferhistory/TransferHistory";
import Cookies from 'js-cookie';
import CheckOtpTransfer from "./pages/checkotpcode/CheckOtpTransfer";
import ConfirmTransfer from "./pages/confirmtransfer/ConfirmTransfer";
import CheckOtpCodePayment from "./pages/checkotpcode/checkOtpCodePayment";
import GetPayment from "./pages/getpament/getPayment";
import { useEffect, useState } from "react";
import Payment from "./pages/payment/Payment";
function App() {
  const [user, setUser] = useState({});
    useEffect(() => {
      const token = Cookies.get('token');
      const getUser = async () => {
          const user = await fetch("http://localhost:3000/balance",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Application-Type": "application/json",
                  },
                  body: JSON.stringify({token: token}),
              }
          );
          const userRes = await user.json();
          setUser(userRes);
          console.log(userRes);
      };
      getUser();
  }, []);
  return (
    <BrowserRouter>
      <div>  
      <Navbar user={user}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element = {<Register />} /> 
          <Route path="/checktransfer" element = {<CheckTransfer />} />    
          <Route path="/transfer" element = {<Transfer />} />  
          <Route path="/change_password" element = {<ChangePassword user = {user}/>} />   
          <Route path="/confirmotp" element = {<CheckOtpCode />} /> 
          <Route path="/transferHistory" element = {<TransferHistory />} />    
          <Route path="/paymentHis" element = {<GetPayment inSystem={true} type={"Lịch sử đóng học phí"}/>} />    
          <Route path="/verify_user" element = {<CheckOtpCode />} />    
          <Route path="/verify_login" element = {<CheckOtpCode />} />  
          <Route path="/verify_transfer" element = {<CheckOtpTransfer />} /> 
          <Route path="/verify_payment" element = {<CheckOtpCodePayment />} /> 
          <Route path="/payment" element = {<Payment />} />  
          <Route path="/getpayment" element = {<GetPayment inSystem={false} type={"Liệt kê danh sách học phí chưa đóng"} />} />    
          <Route path="/verify_change_password" element = {<CheckOtpCode user = {user} />} />    
          <Route path="/confirm_transfer" element = {<ConfirmTransfer />} />
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
