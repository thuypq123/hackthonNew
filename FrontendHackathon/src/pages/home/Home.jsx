import React from 'react'
import "./home.css"
import Marquee from "react-fast-marquee";
import panner1 from "../../Images/panner1.jpg"
import panner2 from "../../Images/panner2.jpg"
import panner3 from "../../Images/panner3.jpg"
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Navbar from '../../components/navbar/Navbar';


const images = [panner1, panner2, panner3];
const zoomOutProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  scale: 0.4,
  arrows: true
};

const Slideshow = () => {
  return (
    <div className="slide-container">
      <Zoom {...zoomOutProperties}>
        {images.map((each, index) => (
          <img key={index} style={{ width: "100%" }} src={each} />
        ))}
      </Zoom>
    </div>
  );
};

function Home() {
  return (
    <>
      <div className='homePage'>
        <div className="homeContainer">
          <div className='slideParagraph'>
            <Marquee className='marquee' speed={250} gradient={false}>
              ❤️  Project of the 2D and 2T team ❤️
            </Marquee>
          </div>
          <div className='homePanner'>
            <Slideshow />
          </div>
          <div className='homeDetail'>
            <h1>Sản phẩm cá nhân</h1>
            <p>Với hệ sinh thái độc đáo, HDBank cung cấp đa dạng các sản phẩm, dịch vụ đáp ứng nhu cầu của từng cá nhân riêng biệt, hộ gia đình hay hộ kinh doanh vừa và nhỏ trên khắp cả nước; không ngừng đổi mới, phát triển để ngày một hoàn thiện hơn, đảm bảo khách hàng luôn có một trải nghiệm hoàn hảo nhất.</p>
          </div>
        </div>
      </div>
    </>

  )
}

export default Home
