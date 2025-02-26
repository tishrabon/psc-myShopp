import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiLogoGmail } from 'react-icons/bi';

import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { fetchUserData } from '../../redux/slice/userDataSlice';
import { registerUSER, loginUSER } from '../../redux/slice/authSlice';


import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const Login = () => {
  const log = {    
    welcome: `resmenu-shadow p-3 centaY rounded-[10px] bg-green-600 text-white flex-wrap my-5 w-full`,
    forma: `centaY resmenu-shadow p-5 rounded-[10px] w-full`,
    inputa: `border-[1px] bg-gray-100 p-1 m-1 rounded-[5px] w-[250px] ss:w-[300px]`,
    logbutton: `border-[1px] bg-blue-600 text-white p-1 m-1 rounded-[5px] w-[250px] ss:w-[300px] h-10`,
    gmloginbtn: `border-[1px] bg-yellow-600 text-white p-1 m-1 rounded-[5px] w-[250px] ss:w-[300px] h-10 flex justify-center items-center gap-x-1`,

  }
 
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const provider = new GoogleAuthProvider(); 

  //regular login
  const exeLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, psw);
      setEmail("");
      setPsw("");

      dispatch(
        loginUSER()
      );
      navigate("/");

    } catch (error) {
      console.error(error.message);
      alert(error);
    }
  }

  //google login...
  const signinbyGoogle = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const additionalUserInfo = getAdditionalUserInfo(userCredential);
      const isNewUser = additionalUserInfo.isNewUser;

      if (!isNewUser) {
        dispatch(
          loginUSER()
        );
        navigate("/user");

      } else {           
        dispatch(
          registerUSER({
            pass: "googlepopup",
            uid: user.uid,
            // username: newUsername,
            email: user.email, 
          })
        );
        dispatch(
          loginUSER()
        );
        navigate("/");
      }
   
    } catch(error) {
      console.error(error.message);
      alert(error);
    } 

  }

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
    <section className="centaY max-w-[700px] min-w-[300px] ss:min-w-[400px]">
      <ToastContainer />
      <div className={log.welcome}>
        <h3>Welcome to myShopp!</h3>
        <span>
          Please Login to enjoy our online shopping...
        </span>
      </div>          

      <form className={log.forma}
        onSubmit={exeLogin}
      >
        <input 
          className={log.inputa} type="text" placeholder="Email" value={email} 
          onChange={e => setEmail(e.target.value)}
        />

        <input 
          className={log.inputa} type="password" placeholder="Password" value={psw} 
          onChange={e => setPsw(e.target.value)}
        />
        
        <button type="submit" className={log.logbutton}>Login</button>


        <span className="text-sm text-gray-500 py-2 border-b mb-2">
          Forgot Password? <Link className="text-red-600 hover:underline" to="/reset">Reset</Link> Here 
        </span>

        {/* <span className={`mt-5`}>          
          Or SignIn with Google
        </span>

        <button type="button" className={log.gmloginbtn}
          onClick={signinbyGoogle}
        >
          <BiLogoGmail size={25} className="text-green-300"/>
          <span>Google</span>
        </button> */}

        <div className="centaY text-sm text-gray-500">
          <span>
            Don't have an account? Don't worry!             
          </span>
          <span>
            Click here 
            <Link className="text-green-700 hover:underline ml-1" to="/register">Register</Link>
            </span>
        </div>

      </form>
    </section>
  )
}

export default Login;
