import "./footer.css";
import {
    BsLinkedin,
    BsFacebook,
    BsGithub,
    BsInstagram,
    BsTwitter,
} from "react-icons/bs";

import img from "../../Images/LogoHDBank.png";
function Footer() {
    return (
        <div className="footer">
            <div className="footerContainer">
                <div className="fLists">
                    <div className="fList">
                        <img src={img} className="fImg" alt="" />
                        <div className="fListItem">
                            Making the world a better place through constructing elegant
                            hierarchies
                        </div>
                    </div>
                    <ul className="fList">
                        <li className="fListItem" >Vì sao chọn HDBank?</li>
                        <li className="fListItem">Về chúng tôi</li>
                        <li className="fListItem">Tuyển dụng</li>
                        <li className="fListItem">Tin tức và sự khiện</li>
                      
                    </ul>
                    <ul className="fList">
                        <li className="fListItem">Khách hàng cá nhân</li>
                        <li className="fListItem">Ngân hàng điện tử</li>
                        <li className="fListItem">Sản phẩm vay</li>
                        <li className="fListItem">Sản phẩm tiền gửi</li>
                        <li className="fListItem">Sản phẩm dịch vụ</li>
                        <li className="fListItem">Bảo hiểm</li>
                    </ul>
                    <ul className="fList">
                        <li className="fListItem">CONTACT INFO</li>
                        <li className="fListItem">Phone: +84 392598628</li>
                        <li className="fListItem">Email: daoduc132@gmail.com</li>
                        <li className="fListItem">Location: Ho Chi Minh City, Vit Nam</li>
                        <div className="iconLink">
                            <BsGithub />
                            <BsFacebook />
                            <BsInstagram />
                            <BsTwitter />
                            <BsLinkedin />
                        </div>
                    </ul>
                </div>
                <p className="fText">Copyright @2022 2D && 2T</p>
            </div>
        </div>

    );
}

export default Footer;
