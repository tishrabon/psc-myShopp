import React, {useState, useRef, useEffect} from 'react';
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';
import { CiSaveUp2 } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { MdEmail } from "react-icons/md";

const ProjectDocument = () => {

  const location = useLocation();

  const navButtonActive = `border-none bg-white rounded-md text-gray-800`
  const docContent = `px-2 py-1`;
  const docHeading = `p-1 border-none bg-gray-200 rounded-md`;
  const pBlock = `my-1 border-b pb-1`;
  const pBlockClose = `my-1 pb-1`;

  const [route, setRoute] = useState("devs");

  const devsRef = useRef(null);
  const aboutProjectRef = useRef(null);
  const builtWithRef = useRef(null);
  const requirementsRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const adminsRef = useRef(null);
  const toHrRef = useRef(null);

  const scrollTo = (targetRef) => {
    targetRef.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    if (location.hash === "#toHr") {
      setRoute("tohr");
      scrollTo(toHrRef);      
    } else if (location.hash === "#devs") {
      setRoute("devs");
      scrollTo(devsRef);
    }

  }, [location])

  return (
    <section className="w-full">
      <h5 className="text-center border-none bg-maincolor text-white p-1 rounded-md py-2 mb-3">Project Documentation</h5>
      
      <div className="flex flex-col sm:flex-row gap-2">
        
        {/* ROUTES */}
        <div className="w-full sm:w-[150px] border-none rounded-md p-2 flex flex-row flex-wrap sm:flex-col gap-1 sm:gap-y-2 bg-gray-200 text-xs sm:text-sm sm:overflow-y-auto">


          <button className={`${route === "devs" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("devs");
              scrollTo(devsRef);
            }}
          >
            Developer's Word
          </button>

          <button className={`${route === "aboutProject" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("aboutProject");
              scrollTo(aboutProjectRef);
            }}
          >
            About Project
          </button>

          <button className={`${route === "builtWith" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("builtWith");
              scrollTo(builtWithRef);
            }}
          >
            Built With
          </button>

          <button className={`${route === "requirements" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("requirements")
              scrollTo(requirementsRef);
            }}
          >
            Requirements Before Purchase
          </button>

          <button className={`${route === "search" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("search");
              scrollTo(searchRef);
            }}
          >
            Advanced Search
          </button>

          <button className={`${route === "cart" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("cart");
              scrollTo(cartRef);
            }}
          >
            Cart & Liked Products
          </button>

          <button className={`${route === "admins" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("admins");
              scrollTo(adminsRef);
            }}
          >
            Admin Section
          </button>

          <button className={`${route === "tohr" ? navButtonActive : ""} text-gray-700 px-2 p-1`}
            onClick={() => {
              setRoute("tohr");
              scrollTo(toHrRef);
            }}
          >
            To Recruiter
          </button>

        </div>

        {/* DOCS */}
        <div className="w-full sm:min-w-[400px] border rounded-md p-1 text-md h-[60vh] sm:h-[70vh] overflow-y-auto flex flex-col gap-5 text-gray-700">
          
          {/* devsRef */}
          <div>
            <h6 ref={devsRef} className={docHeading}>Developer's Word</h6>
            <div className={docContent}>
              {/* INTRO */}
              <div>
                Hi, I'm Towhidul Islam Shrabon. You can call me Shrabon. Hopefully you can find me by googling <span className="text-blue-700">tishrabon</span>. I’m currently honing my skills as a front-end developer, with the ultimate goal of becoming a full-stack developer. Feel free to connect with me through my social media links and Gmail address below.

                {/* SOCIAL MEDIA LINKS */}
                <ul className="m-[10px] border rounded-md p-1 my-1">                  
                  <li title="linkedIn profile link: https://www.linkedin.com/in/tishrabon/" className="grid grid-cols-[20px_1fr] items-center">
                    <FaLinkedin /> <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/tishrabon/">in/tishrabon</a>
                  </li>                  

                  <li title="Github profile link: https://github.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center">
                    <FaGithubSquare /> <a target="_blank" rel="noopener noreferrer"  href="https://github.com/tishrabon/">/tishrabon</a> 
                  </li>

                  <li title="Instagram profile link: https://www.instagram.com/tishrabon/" className="grid grid-cols-[20px_1fr] items-center">
                    <FaInstagramSquare /> <a target="_blank" rel="noopener noreferrer"  href="https://www.instagram.com/tishrabon/">/tishrabon</a>
                  </li>

                  <li title="X profile link: https://x.com/tishrabon" className="grid grid-cols-[20px_1fr] items-center">
                    <FaSquareXTwitter /> <a target="_blank" rel="noopener noreferrer"  href="https://x.com/tishrabon">@tishrabon</a>
                  </li>

                  <li title="Developer's gmail address" className="grid grid-cols-[20px_1fr] items-center">
                    <MdEmail /> <span>tishrabon.official@gmail.com</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* aboutProjectRef */}
          <div>
            <h6 ref={aboutProjectRef} className={docHeading}>About My Project</h6>
            <div className={docContent}>
              <p className={pBlock}>
                This is my first complete project! I wanted to finish a full project before creating my portfolio, focusing on honing my programming skills rather than just showcasing. It took me quite some time to perfect it, and I’m excited to include this work in my portfolio.
              </p>
              <p className={pBlock}>
                This e-commerce website allows users to create accounts, like products, add items to their cart, and place orders seamlessly. All data is securely stored in a Firestore database, enabling users to log in from anywhere and access their information effortlessly.
              </p>
              <p className={pBlockClose}>
                There are options for both users and admins. The admin section includes extra features and different designs few parts, and I recommend trying both. However, please avoid creating unnecessary accounts, as it would be helpful for me.
              </p>
            </div>
            
          </div>

          {/* builtWithRef */}
          <div>
            <h6 ref={builtWithRef} className={docHeading}>Built With</h6>

            <div className={docContent}>
              <ul className="list-disc list-inside flex flex-col border-b my-1 pb-1 gap-y-1">                              
                <li>
                  Language: JavaScript, Html, Css
                </li>

                <li>
                  JavaScript Library: ReactJs
                </li>

                <li>
                  Framework: TailwindCss
                </li>
              </ul>

              <ul className="list-disc list-inside flex flex-col gap-y-1">
                <li>
                  Database: Firebase
                </li>

                <li>
                  State Management: Redux Toolkit
                </li>

                <li>
                  Icons: React Icons
                </li>

              </ul>              
            </div>

          </div>


          {/* requirementsRef */}
          <div>            
            <h6 ref={requirementsRef} className={docHeading}>Requirements Before Purchase</h6>
            <div className={docContent}>
              <p className={pBlock}>
                After creating account, there are 2 steps to complete your profile.
              </p>
              <p className={pBlock}>
                (1) Update your basic informations like name, username, date of birth and gender. Users must check if the username is available before confirming the update. There is a button there to check it. 
              </p>
              <p className={pBlockClose}>
              (2) You must set at least one address before placing any orders. Otherwise, you won't be able to proceed. You can add up to three addresses. If multiple addresses are set, users can simply click on the address to switch to their preferred address for product delivery. And I believe this feature adds great convenience!
              </p>
            </div>
          </div>

          {/* searchRef */}
          <div>            
            <h6 ref={searchRef} className={docHeading}>Advanced Search</h6>
            <div className={docContent}>
              <p className={pBlock}>
                I wanted to make a dedicated search facilities for the users and the search option is not traditionally in the header section. It's in the homepage where products are shown. There are 3 types of search options.
              </p>
              <p className={pBlock}>
                (1) Regular search option, where you can search by product's names or tags by typing word.
              </p>
              <p className={pBlock}>
                (2) Search by price range, To be honest it sometimes doesn't work properly especially if users try it without refreshing search. But it works good at first or after refreshing search. I confess my limitation here. Maybe I will update it later.
              </p>
              <p className={pBlock}>
                (3) Search by tags, in-stock items, or sold-out items. This section displays all tags from various products. Initially, a few tags are shown, but there’s a button to reveal all of them. Users can simply click on the tags to view items related to those selections.
              </p>              
              <p className={pBlockClose}>
                And lastly, there's the refresh search button. Sometimes, the search may not work properly, so I created this feature to clear any bugs. If the search isn’t functioning as expected, click it to refresh. Hopefully, users won’t encounter any issues afterward.
              </p>
            </div>
          </div>

          {/* cartRef */}
          <div>            
            <h6 ref={cartRef} className={docHeading}>Cart & Liked Products</h6>
            <div className={docContent}>
              <p className={pBlock}>
                There are two options for storing products in user data.
              </p>
              <p className={pBlock}>
                (1) The cart is primarily for products users intend to buy later. Users can add unavailable items to the cart, but they won't be able to proceed with orders for those products.                               
              </p> 
              <p className={pBlockClose}>
                (2) Liked Products: Users may not want to add all their favorite items to the cart, as this can clutter it with unnecessary products and make it difficult to find what they truly need. To address this, I created an option for users to add products to a separate Liked Items list, keeping their cart organized.
              </p>                          
            </div>
          </div>

          {/* adminsRef */}
          <div>            
            <h6 ref={adminsRef} className={docHeading}>Admin Section</h6>
            <div className={docContent}>
              <p className={pBlock}>
                Admin's section adds some extra features. But first, Let's talk about how to create admin account. Simply in the register page, there is toggle option for switching to admin's register form. There is an extra requirement for creating admin account. It is a <span className="text-red-600">passkey</span> which can only be given from the administration. Since it's a portfolio project, I made a visitor's passkey if anyone wants to see admin panel. the passkey is "<span className="text-red-600">go-visit-12-12</span>". About admin panel, There are basically two sections.
              </p> 
              <p className={pBlock}>
                (1) Comprehensive block consisting all the necessary information of users including email, basic informations, addresses, orders etc. There is also a dedicated search facilities for admins.
              </p> 
              <p className={pBlockClose}>
                (2) Secondly there is a dedicated section for orders including total sales, total orders, deliered, on the way orders, orders that has not been received by users yet etc. There is also comprehensive blocks of users with all of their order related datas. In this section, users that has not made any orders will not be shown. 
              </p>

            </div>
          </div>

          {/* toRecruiter */}
          <div>
            <h6 ref={toHrRef} className={docHeading}>To Recruiter</h6>
            <div className={docContent}>
              <p className={pBlock}>
                I'm a self-taught programmer. I was majoring in Computer Science & Engineering but decided to take a break due to certain circumstances. I may continue in the future.
              </p>
              <p className={pBlock}>
                This is not a unique/rare/uncommon idea-based project. I wanted to make something which will include skills and functionalities of coding. That's why I decided to make this kind of project in the first place. To be honest, I focused on functionalities more than designs. 
              </p>
              <p className={pBlock}>
                This is my first fully-functional front-end application. I didn’t create a portfolio initially because I focused on honing my skills rather than showcasing them. It took time to perfect this project, and if you check my source code, you'll notice my transitions and growth throughout. I won’t share the code here, but I’ll include it in my upcoming portfolio. While I learned from platforms like YouTube, Google, ChatGPT etc, I never copied any code, so my code may not be as polished as a professional’s.         
              </p>              
              <p className={pBlock}>
                While working on this project, I learned a great deal and identified many areas for improvement. However, changing the code now would be quite challenging. Therefore, I plan to implement these learnings in my future projects, including my portfolio.
              </p> 
              <div className={pBlock}>
                I genuinely appreciate your time in reviewing my project. If it doesn’t quite resonate with your needs, I invite you to connect on <a title="Developer's LinkedIn Profile Link" className="text-blue-600" target="_blank" rel="noopener noreferrer"  href="https://www.linkedin.com/in/tishrabon/">LinkedIn</a>. My other social media links and Gmail address are listed above <CiSaveUp2 className="inline align-middle cursor-pointer mb-[2px] text-blue-700" onClick={() => {scrollTo(devsRef); setRoute("devs")}} />. I’d love the opportunity to stay in touch for potential future collaborations. Let’s keep the conversation going! Until next time.
              </div>
              <p className={pBlockClose}>
                Excited for what lies ahead...
              </p>  
            </div>
          </div>
          
        </div>
      </div>

    </section>
  )
}

export default ProjectDocument;