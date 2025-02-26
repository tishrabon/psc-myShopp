import React, {useEffect, useState} from 'react'; 
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import slide1 from '../../assets/slide-1.gif'
import slide3 from '../../assets/slide-3.svg'


const Hero = () => {

  const slidaImg = [
    slide1,
    "https://i.ibb.co.com/HGmMByx/slide-2-8bit.png",
    slide3,
    "https://i.ibb.co.com/zmQkcsh/slide-4-8bit.png",
    "https://i.ibb.co.com/BN87vCd/slide-5.png",
    "https://i.ibb.co.com/sgqhrFf/slide-6-8bit.png"
  ]

  const styles= {
    prevSlide: `absolute left-0 z-[10] top-[40%] ml-3 border-none bg-gray-400 opacity-30 p-1 rounded-[50%]`,
    nextSlide: `absolute right-0 z-[10] top-[40%] mr-3 border-none bg-gray-400 opacity-30 p-1 rounded-[50%]`,
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const navSlide = (dir) => {
    if (dir === "prev") {
      if (currentIndex === 0) {
        setCurrentIndex(slidaImg.length - 1);
      } else {
        setCurrentIndex(prev => prev);
      }
    } else {

    }
  }
 
  useEffect(() => {
    const entarval = setInterval (() => {
      setCurrentIndex(prev => (prev + 1) % slidaImg.length);
    }, 5000);

    return () => clearInterval(entarval);
  }, []);


  return (
    <section>         
      <div className="h-[300px] w-full relative overflow-hidden my-2 rounded-md"> 

        <button className={styles.prevSlide}
          onClick={() => setCurrentIndex(prev => (prev - 1 + slidaImg.length) % slidaImg.length)}
        >
          <GrLinkPrevious />
        </button>
        <button className={styles.nextSlide}
          onClick={() => setCurrentIndex(prev => (prev + 1) % slidaImg.length)}          
        >
          <GrLinkNext />
        </button>       
        
        
        <div 
          className="flex transition-transform duration-700 bg-red-100 h-full w-full"
          style={{transform: `translateX(-${currentIndex * 100}%)`}}
        >            

          {slidaImg.map((img, index) => (
            <img key={index} src={img} alt="" className="object-cover object-center w-full flex-shrink-0 h-full"/>
          ))}
        </div>          
        
      </div>
    </section>
  )
}

export default Hero;