import React from 'react';
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";


const Footer = () => {

  const foot = {
    container: `flex flex-col justify-center items-center bg-maincolor text-yellow-400 w-full mt-20 p-5 gap-y-1`,
  }

  return (
    <section className={foot.container}>
      <div className="flex flex-col place-items-center gap-x-1 text-sm text-center">
        <span className="border-b border-yellow-400 pb-1 mb-1">&copy; Originally Coded By</span>
        <span>Towhidul Islam Shrabon</span>
        
      </div>
      <div className="flex flex-col justify-center items-center gap-y-2">
        <a 
          className="w-[100px] my-5"
          title="Visit My Website!"
          target="_blank" rel="noopener noreferrer" href="https://tishrabon.github.io/"
        >
          <img src="/tishrabon-logo.svg" alt="" />
        </a>

        <div className="flex items-center gap-2">
          <FaGlobe />
          <p className="mb-[2px]">tishrabon.github.io</p>
        </div>

        <div className="flex items-center gap-2">
          <MdEmail />
          <p className="mb-[2px]">tishrabon.official@gmail.com</p>
        </div>        

        <div className="flex items-center gap-x-1 text-xl ml-[2px]">

          <div title="linkedIn profile link: https://www.linkedin.com/in/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/tishrabon/"><FaLinkedin /></a>
          </div>      

          <div title="Github profile link: https://github.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/tishrabon/"><FaGithubSquare /></a>
          </div>

          {/* <div title="Instagram profile link: https://www.instagram.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer"  href="https://www.instagram.com/tishrabon/"><FaInstagramSquare /></a>
          </div> */}

          <div title="X profile link: https://x.com/tishrabon" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer"  href="https://x.com/tishrabon"><FaSquareXTwitter /></a>
          </div>

        </div>
            
      </div>
    </section>
  )
}

export default Footer;
