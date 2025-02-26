import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';

const Reset = () => {
  const res = {    
    forma: `centaY resmenu-shadow p-5 rounded-[10px] max-w-[350px] min-w-[200px]`,
    inputa: `border-[1px] bg-gray-100 p-1 m-1 rounded-[5px] w-full`,
    resetbtn: `border-[1px] bg-red-600 text-white p-1 m-1 rounded-[5px] w-full h-10`,  
  }

  const [resetEmail, setResetEmail] = useState("");

  const exeReset = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        toast.success("If email matches, we'll send a code to the email to reset! Please check your mail")
      })
      .catch((error) => {
        toast.error(error.message);
      })

  }

  return (
    <section>
      <ToastContainer />
      <form className={res.forma} onSubmit={exeReset}>

        <span className="text-sm text-gray-500 my-3 text-center">Give us your email address, we will send you the code to reset</span>
        
        <input 
          type="text" className={res.inputa} value={resetEmail} placeholder="Email" 
          onChange={e => setResetEmail(e.target.value)}
        />

        <button type="submit" className={res.resetbtn} >Reset!</button>

        <span  className="text-sm text-gray-500 my-3">
          Go to <Link to="/login" className="text-blue-600 hover:underline mr-1">Login</Link> 
          or <Link to="/register" className="text-green-600 hover:underline">Register</Link> 
        </span>

      </form>
    </section>
  )
}

export default Reset;