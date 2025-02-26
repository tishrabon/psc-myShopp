import React from 'react';
import { RiLightbulbFlashLine } from "react-icons/ri";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const foot = {
    container2: `flex items-center w-full bg-maincolor px-[30px] py-[20px] rounded-[20px] text-white justify-between mt-3`,
    container: `flex flex-col justify-center items-center bg-maincolor text-yellow-400 w-full mt-20 p-5 gap-y-1`,
  }

  const navigateToDevs = () => {
    navigate("/projectdoc#devs");
  }


  return (
    <section className={foot.container}>
      <div className="flex items-center gap-x-1 text-sm">
        {/* <RiLightbulbFlashLine /> <span>Developed By <span className="">Towhidul Islam Shrabon</span> </span> */}
        &copy; <span>Coded By <span className="">Towhidul Islam Shrabon</span> </span>
      </div>
      <div className="flex flex-col justify-center items-center gap-y-2">
        <p className="px-1 text-sm border border-yellow-400 rounded-md cursor-pointer hover:border-yellow-600 hover:text-yellow-600"
        onClick={navigateToDevs}
        >
          {"<"} tishrabon {"/>"}
        </p>

        <div className="flex items-center gap-x-1 text-xl ml-[2px]">

          <div title="linkedIn profile link: https://www.linkedin.com/in/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/tishrabon/"><FaLinkedin /></a>
          </div>      

          <div title="Github profile link: https://github.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/tishrabon/"><FaGithubSquare /></a>
          </div>

          <div title="Instagram profile link: https://www.instagram.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer"  href="https://www.instagram.com/tishrabon/"><FaInstagramSquare /></a>
          </div>

          <div title="X profile link: https://x.com/tishrabon" className="grid grid-cols-[20px_1fr] items-center hover:text-yellow-600">
            <a target="_blank" rel="noopener noreferrer"  href="https://x.com/tishrabon"><FaSquareXTwitter /></a>
          </div>

        </div>
            
      </div>
    </section>
  )
}

export default Footer;