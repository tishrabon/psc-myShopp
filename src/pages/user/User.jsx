import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import { MdVerifiedUser } from 'react-icons/md';
import { GoUnverified } from "react-icons/go";
import { FaUser } from 'react-icons/fa6';
import { GrUserAdmin } from "react-icons/gr";

const User = () => {

  const userStyle = {
    box: `flex flex-col justify-between items-start gap-y-3 resmenu-shadow p-5 rounded-[10px] w-[90%] mb-1`,
    billboard: ` p-3 centaY rounded-[10px] bg-green-600 text-white flex-wrap mb-3 w-[90%]`,
    ondown: `flex flex-col justify-between items-start gap-y-1`,
    info: `m-[20px]`,
    demo: `bg-green-400 h-[90px] w-[90px] m-5 centaY`,
    gapX2: `flex flex-row gap-x-1`,
    gapX: `grid grid-cols-[70px_1fr] text-sm`,
    updateButton: `p-2 mt-2 mb-5 rounded border-none bg-green-600 text-sm text-white`,

    addressBox: `my-2 w-full h-full flex flex-col justify-center items-center text-sm`,
    addressBlock: `mb-2 w-full h-full p-1 border rounded-md`,
    addressLabel: `bg-gray-300 flex rounded-md p-1 py-1 justify-start text-sm overflow-hidden`,
  
  };  

  const allData = useSelector(state => state.userData.currentUserData) || {};
  const [verifyNotice, setVerifyNotice] = useState(false);
  const [askVerify, setAskVerify] = useState(false);

  const navigate = useNavigate();

  const exeVerifyEmail = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      try {
        setVerifyNotice(true);
        await sendEmailVerification(user);
        alert("If email matches, verification mail will be sent. Please check your mail...");

        await updateDoc(doc(db, "userData", allData.uid), {
          verificationAlert: true
        });

      } catch (err) {
        console.error(err);
      }

    }

  }

  useEffect(() => {
    const forLoggedIn = async () => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if(user === null) {
          navigate("/");
        }
      });
      return () => {
        unsub();
      }
    }

    forLoggedIn();
  }, [])

  
  return (
    <section className="centaY w-full sm:w-[550px]">
      
      <div className={userStyle.billboard}>User's Profile</div>

      <div className={userStyle.box}>

        <div className={`${userStyle.ondown} w-full overflow-hidden`}> 
          
          {/* BASIC UPDATE NOTIFICATION */}
          {allData && allData.basicDone ? 
            null
          : 
            <p className="flex-wrap text-xs text-red-600 border-b pb-1">Dear User, Please update you basic information!</p>
          }
          
          <p className={`text-lg ${allData && !allData.admin ? "border-b" : ""}`}>{allData.displayName || "Name not set"}</p> 
          
          {/* CAN DO SECTION </p> */}
          {allData && !allData.admin ? 
            <div className="text-sm w-auto border-b mb-2 py-1">
              <p className=" border-none bg-green-600 rounded-sm text-white p-1 flex justify-start items-center gap-x-1">
                <FaUser size={12}/> <span className="mt-[2px]">user/{allData.role}</span>
              </p> 
              <p className="text-xs mt-1">Access: {allData.canDo}</p>
            </div>
          :
            <div className="text-sm w-auto border-b mb-2 py-1">
              <p className=" border-none bg-maincolor rounded-sm text-white p-1 flex justify-start items-center gap-x-1">
                <GrUserAdmin/> <span className="mt-[2px]">admin/{allData.role}</span>
              </p>
              <p className="text-xs mt-1">Possession: {allData.canDo}</p>
            </div>
          }          

          {/* X X X X USER INFORMATIONS X X X X */}
          <div className={`${userStyle.gapX}`}>        
            <span className="text-green-800">username</span> 
            <span>
              : {allData.username || "..."} 
            </span>                                
          </div> 

          <div className={`${userStyle.gapX} items-center`}>        
            <span className="text-green-800">Email</span> 
            <span className="flex items-center gap-1 flex-wrap">
              <span className="text-xs sm:text-sm">: {allData.email || "..."}</span> 
              <span className={`${allData.createdBy === "emailnpsw" && !allData.emailVerified ? "" : "hidden"} text-green-600 text-xs sm:text-sm`}>              
              < GoUnverified />
            </span>

            <span className={`${allData.emailVerified ? "" : "hidden"} text-green-600`}>              
              < MdVerifiedUser />
            </span>
            </span>   

          </div>

          <div className={`${allData && !allData.emailVerified ? "" : "hidden" } text-xs ml-[74px]`}>           
            {/* <span className="text-red-600">email not verified!</span> */}
            <button className={` text-blue-600 px-1 border border-blue-600 rounded-sm`} onClick={() => {setAskVerify(prev => !prev)}}>Verify your mail</button>            
          </div>


          {/* EMAIL VERIFICATION DIVISION */}
          <div className={`${askVerify ? "ml-[74px]" : "hidden"}`}>
            <div className={`${allData.createdBy === "emailnpsw" && !allData.emailVerified ? "" : "hidden"} px-2`}>
                {!verifyNotice ? 
                  <button className={`text-[11px] text-red-600 items-center border rounded-sm mx-1 px-2 border-red-500`} onClick={exeVerifyEmail}>Click to verify</button>
                :
                  <span className={`text-sm text-blue-600 items-center`}>If this email exists, verification mail will be sent. Please check your mail.</span>
                }
            </div>

          </div>


          <div className={`${userStyle.gapX}`}>        
            <span className="text-green-800">Born</span> 
            <span>
              : {allData.dob || "..."} 
            </span>                                
          </div> 

          <div className={`${userStyle.gapX}`}>        
            <span className="text-green-800">Gender</span> 
            <span>
              : {allData.gender || "..."} 
            </span>                                
          </div> 

          <div className={`${userStyle.gapX}`}>      
            <span className="text-green-800">Joined</span> 
            <span>
              : {allData.createTime && allData.createTime.datePlain || ""} {allData.createTime && allData.createTime.timePlain || ""}
            </span>                                
          </div> 
        </div> 


        {/* ADDRESSES WILL BE HERE      */}        
        {allData.addresses && allData.addresses.length !== 0 ? 
          <div className={userStyle.addressBox}>
            <p className="mb-1">Your Addresses:</p>
            {allData.addresses.map((take, index) => (
              <div key={take.id} className={userStyle.addressBlock}>
                {/* {index} - {take.complete} */}
                <div className={userStyle.addressLabel}>                  
                  <p>{take.state}, {take.country}</p>
                </div>
                <p className="p-1 text-sm">
                  {take.details}, {take.district}, {take.zipcode}, {take.state}
                </p>

              </div>
            ))}
          </div> 
        : 
          <div className="w-full flex justify-between items-center">
            <div className={`${allData.addresses && allData.addresses.length === 0 ? "" : "hidden"} w-full border border-red-600 bg-gray-200 rounded-md p-2 text-sm text-red-600 text-center`}>You have not saved any addresses yet! It's important, You cannot proceed order without setting your address first! Go to update to set your address</div>
          </div>          
        }

      </div>  

      <Link to="/updateuser" className={userStyle.updateButton}>
        Update / Delete 
      </Link>      

      {/* <div className={`${userStyle.billboard}`}>User's Block: Products</div> 

      <div className={`${userStyle.box} mt-[1px]`}>
        <span>No offense, Our beloved user is not matured yet...</span>
      </div> */}

    </section>
  )
}

export default User;