import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

import { registerUSER } from '../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const reg = {    
    welcome: `resmenu-shadow p-3 centaY rounded-[10px] bg-green-600 text-white flex-wrap my-5 w-full`,
    forma: `centaY resmenu-shadow p-5 rounded-[10px] w-full`,
    inputa: `border-[1px] bg-gray-100 p-1 m-1 rounded-md w-[250px] ss:w-[300px] text-gray-700 text-md`,
    signupbtn: `border-[1px] bg-green-600 text-white p-1 m-1 rounded-[5px] w-[250px] ss:w-[300px] h-10`,
    gmloginbtn: `border-[1px] bg-yellow-600 text-white p-1 m-1 rounded-[5px] w-[250px] ss:w-[300px] h-10 flex justify-center items-center gap-x-1`,
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FORM STATES 
  const [newEmail, setNewEmail] = useState(""); 
  const [newPsw, setNewPsw] = useState(""); 
  const [cPsw, setCPsw] = useState(""); 

  // ADMIN THINGS
  const [role, setRole] = useState("kire kamrule?");
  const [canDo, setCanDo] = useState("");
  const [adminForm, setAdminForm] = useState(false);
  const [passApproved, setPassApproved] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPsw, setAdminPsw] = useState("");
  const [adminCPsw, setAdminCPsw] = useState("");
  const [adminsPass, setAdminsPass] = useState("");
  const [passUpdate, setPassUpdate] = useState("");
  

  const inputcleaner = () => {
    setNewEmail("");
    setNewPsw("");
    setCPsw("");
    setAdminsPass("");
    setRole("");
    setPassApproved(false);
    setCanDo("");

  }

  const checkAdminPass = async (e, pass) => {
    e.preventDefault();
    setPassUpdate("");
    setRole("")
    setCanDo("");
    setPassApproved(false);
    try {
      if (pass !== "") {

        const docRef = doc(db, "admins", "administrative-docs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
          const passcodes = docSnap.data().adminsPass

          let tempRole = "";
          let tempCanDo = "";
    
          for (const take of passcodes) {
            if (take.passcode === pass) {
              tempRole = take.role;
              tempCanDo = take.canDo;
              break;
            }              
          }    
  
          if (tempRole !== "") {
            setRole(tempRole);
            setCanDo(tempCanDo);
            setPassUpdate(`Your pass has been verified! <br /> Role: "${tempRole}" <br /> Possesstion: ${tempCanDo}`);
            setPassApproved(true);
          }
          else {            
            setPassUpdate(`Sorry! Your pass has not been verified or try again`);   
            setPassApproved(false);
          }
        } 
    
        else {
          setPassUpdate("Sorry There were some issues! Try again later");
          setPassApproved(false);
        }
    
      }
    } catch (err) {
      console.error(err);
    }
  }

  const exeAdminSignUp = (e) => {
    e.preventDefault();
    if (adminEmail !== "" && adminPsw !== "" && adminCPsw !== "" && role !== "" && passApproved === true && adminPsw === adminCPsw) {
      createUserWithEmailAndPassword(auth, adminEmail, adminPsw)
        .then((userCredential) => {
          const user = userCredential.user;

          dispatch(
            registerUSER({
              pass: "emailnpsw",
              uid: user.uid,
              email: user.email,
              displayName: null,           

              admin: true,
              role: role,
              canDo: canDo
            })
          );
        })
    }
    else {
      console.error("Something went wrong, Please try agian.");
    }
  }

  const exeSignup = async (e) => {
    e.preventDefault();
      if (newEmail !== '' && newPsw !== '' && cPsw !== '' && newPsw === cPsw) {
        createUserWithEmailAndPassword(auth, newEmail, newPsw)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(
            registerUSER({
              pass: "emailnpsw",
              uid: user.uid,
              email: user.email,
              displayName: null,

              admin: false,
              role: "Customer",
              canDo: "Regular facilities as customer"
            })
          ); 
          navigate("/");
        })      
        .catch((error) => {
          console.error(error.message);
          alert(error);
        }); 
      } 
      else {
        console.error("Something went wrong, Please try again");
      }

    inputcleaner();
  }


  useEffect(() => {
    inputcleaner();
  }, [adminForm]);
  // ACCESS ONLY WHILE LOGGEDOUT
  useEffect(() => {
    const forLoggedOut = async () => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if(user) {
          navigate("/");
        }
      });
      return () => {
        unsub();
      }
    }

    forLoggedOut();
  }, []);

  return (
    <section>
      <ToastContainer />   
      {/* CREATE USER WITH EMAIL&PSW    */}
      {!adminForm ? 
        // REGULAR USER FORM
        <form 
          className={reg.forma} 
          onSubmit={exeSignup}
        >
          <div className={reg.welcome}>
            <h3>Welcome to myShopp!</h3> 
            <span> 
              Register to enjoy our online shopping...
            </span>
          </div> 
  
          <input
            type="text" className={reg.inputa} placeholder="Email" required value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />

          <input 
            type="password" className={reg.inputa} placeholder="Password (min 6 character)" required value={newPsw} 
            onChange={e => setNewPsw(e.target.value)}
          />

          <input 
            type="password" className={reg.inputa} placeholder="Confirm Password" required value={cPsw}
            onChange={e => setCPsw(e.target.value)}
          />   
            <button className={reg.signupbtn} type="submit" >Sign Up!</button>
        </form>
      :
        // ADMINS FORM
        <form 
        className={`centaY resmenu-shadow p-5 rounded-[10px] w-full`} onSubmit={exeAdminSignUp}       
        >
        <div className={`resmenu-shadow p-3 centaY rounded-[10px] bg-maincolor text-white flex-wrap my-5 w-full`}>
          <h6>Admin's Register Form</h6> 
        </div> 

          <input
            type="text" className={reg.inputa} placeholder="Email" required value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
          />
          <input 
            type="password" className={reg.inputa} placeholder="Password (min 6 character)" required value={adminPsw}
            onChange={e => setAdminPsw(e.target.value)}
          />
          <input 
            type="password" className={reg.inputa} placeholder="Confirm Password" required value={adminCPsw} 
            onChange={e => setAdminCPsw(e.target.value)}
          />

          <p className="w-[250px] ss:w-[300px] text-center my-3 text-gray-500 box-shadow p-1 text-sm">
            Enter the passcode below. You can get passcodes only from the administration. There are many passcodes depending on the role. For demo purpose, Their is a visitor pass given in the Admin Section of the <Link to="/projectdoc" className="text-blue-600">Project Documentation</Link>. Check that if you need to. 
          </p>

          <input 
            type="text" className={`${reg.inputa}`} placeholder="Passcode" required value={adminsPass}
            onChange={e => setAdminsPass(e.target.value)}
          />

          <p className="w-[250px] ss:w-[300px] text-center my-1 text-red-500 p-1 text-xs">* Check passcode before submission</p>

          <button className="border-none bg-red-600 rounded-sm p-1 px-3 m-1 text-xs text-white"
          onClick={(e) => checkAdminPass(e, adminsPass)}
          >Check Passcode</button>

          <div className={`${passUpdate !== "" ? "" : "hidden"} w-[250px] ss:w-[300px] text-center my-3 text-green-800 box-shadow p-1 text-sm`}>
            <div dangerouslySetInnerHTML={{ __html: passUpdate }} />
            {/* {passUpdate}  */}
          </div>


          <button className={`border-[1px] bg-maincolor text-white p-1 m-1 mt-3 rounded-[5px] w-[250px] ss:w-[300px] h-10`} type="submit" >Sign Up!</button> 
        </form>
      }
      
      
      <div className="centaY text-[14px] text-gray-500 py-3 mt-3 w-full">

        <span className="border-b py-3">Go to <Link className="text-blue-500 hover:underline" to="/login">Login</Link> Page</span>

        <span className="py-3">
          {adminForm ? "Get registration form for user" : "Admin? Get the registration form for admins"}
          <button className="mx-1 text-white border-none px-2 py-1 bg-red-600 rounded-sm" 
          type="button"
          onClick={() => setAdminForm(prev => !prev)}         
          >Click It</button> 
        </span>


      </div>

            
    </section>
  )
}

export default Register;
