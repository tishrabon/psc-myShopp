import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { RiMenuAddLine } from 'react-icons/ri';
import { auth } from '../../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { logoutUSER, loginSTATE } from '../../redux/slice/authSlice';
import { fetchUserData } from '../../redux/slice/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TrueShows } from '../utils/TrueShows';
import { FalseShows } from '../utils/FalseShows';

//  state.userData.currentUserData

const Header = () => {
  const head = {
    container: "sticky top-0 z-[100] border-none flex justify-center items-center bg-maincolor text-white text-[16px] sm:text-base py-3 px-5 mb-3 w-full min-w-[320px] max-w-[100vw]",

    logoside: "flex flex-row justify-center items-center gap-x-3",

    navside: "flex flex-row justify-center items-center gap-x-2 sm:gap-x-5",

    resmenu: `res-menu sm:hidden absolute bg-white text-black p-3 flex-col gap-y-2 rounded-[10px] justify-center top-[65px] right-4`,
    
    cart: `relative`,

    cartCounts: `absolute top-[-11px] right-[10px] text-activefont text-[14px]`,
  }

  const [toggle, setToggle] = useState(false); 
  const menuBarRef = useRef(null);

  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  const counts = useSelector(state => state.userData.currentUserData.carts) || [];
  const [cartCounts, setCartCounts] = useState(0);
  const allData = useSelector(state => state.userData.currentUserData) || {};

  const handleMenuBar = (e) => {
    if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
      setToggle(false);
    }
  }

  const navigateToRecruiters = () => {
    navigate("/projectdoc#toHr");
  }

  useEffect(() => {
    if (toggle) {
      document.addEventListener('mousedown', handleMenuBar);
    }
    else {
      document.removeEventListener('mousedown', handleMenuBar);
    }

    return () => {
      document.removeEventListener('mousedown', handleMenuBar);
    }
    }, [toggle])

  useEffect(() => {
    if (counts) {
      setCartCounts(counts.length);
    }
  }, [counts]);

  useEffect(() => {
    const authCheck = async () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        try {
          if (user) {          
            
            dispatch(
              loginSTATE({
                stateEmail: user.email,
                stateUid: user.uid,
                stateCurrentUser: user.displayName || user.email.substring(0, user.email.indexOf("@")),
              })
            );

            dispatch(
              fetchUserData(user.uid)
            );              
          }
        } catch (err) {
          console.error(err);
        }

      });        
      return () => {
        unsubscribe();
      };
    }
    authCheck();
  }, [])

  const exeSignout = async () => {
    await signOut(auth);
    dispatch(
      logoutUSER()
    );
    window.location.href = "/";
    if (toggle) {
      setToggle(false);
    }
  } 

  return (
    <section className={`headerMain ${head.container}`}>
      
      <div className="w-full flex justify-between items-center max-w-[1300px]">
        {/* LOGO/HOME */}
        <div className={`${head.logoside}`}>
          <Link to="/"> 
            <span className={` text-yellow-400 text-[14px] xs:text-[16px] sm:text-[18px] font-bold`}>myShopp</span>
          </Link>
          <button className="hidden sm:block text-[14px]" onClick={navigateToRecruiters}>
            toRecruiter/Doc
          </button>
        </div>

        {/* NAVIGATION & SIDEBAR DIVISION */}
        <nav>

          {/* nav */}
          <ul  className={`${head.navside}`}>
            <FalseShows>
              <li>           
                <NavLink to="/login">
                  Login
                </NavLink>
              </li>          
            </FalseShows>
            
            <FalseShows>
              <li className="hidden ss:block">           
                <NavLink to="/register">
                  Registar
                </NavLink>
              </li>
            </FalseShows>

            <TrueShows>
              <li>           
                <NavLink  to="/user" className="mr-[-5px] sm:mr-0 centaX text-[12px] sm:text-[16px]">                
                  @{allData && allData.basicDone ? allData.username : "user"} 
                </NavLink>
              </li>
            </TrueShows>
          
            <TrueShows>
              <li className={`${allData && allData.admin ? "flex" : "hidden"} sm:ml-[-16px] mb-[-3px]`}>           
                <NavLink  to="/adminpanel" className="mr-[-15px] sm:mr-0 centaX text-[10px] sm:text-[12px] text-yellow-200 hover:underline">                                  
                  /admin
                </NavLink>
              </li>
            </TrueShows>

            <TrueShows>
              <li>           
                <NavLink to="/orderhistory" className="hidden sm:block">
                  Orders History
                </NavLink>
              </li>
            </TrueShows>

            <TrueShows>
              <li>           
                <button className="hidden sm:block"
                  onClick={exeSignout}
                >
                  Logout
                </button>
              </li>
            </TrueShows>
          
            <li>           
              <NavLink to="/cart" className="centaX gap-x-1">
                <span className="hidden sm:block">Cart</span>
                <span className={head.cart}>
                  <BsCart4 size={30}/>
                  <span className={head.cartCounts}>{cartCounts}</span>
                </span>
              </NavLink>
            </li>

            <span className="sm:hidden block ml-1 cursor-pointer">
              <RiMenuAddLine size={22} 
                onClick={() => setToggle(prev => !prev)}              
              />
            </span>
        
          </ul>

          {/* res menu here yall */}
          <ul ref={menuBarRef} className={`${toggle ? "flex" : "hidden"} ${head.resmenu} resmenu-shadow`}>
            <li>
              <NavLink to="/" onClick={() => setToggle(false)}>Home</NavLink>
            </li>

            <FalseShows>
              <li>           
                <NavLink to="/register" onClick={() => setToggle(false)}>
                  Registar
                </NavLink>
              </li>
            </FalseShows>

            <TrueShows>
              <li>
                <NavLink to="/orderhistory" onClick={() => setToggle(false)}>Order History</NavLink>
              </li>
            </TrueShows>
            
            <li>
              <button 
                onClick={() => {setToggle(false); navigateToRecruiters()}}
              >
                toRecruiter/Doc
              </button>
            </li>

            <TrueShows>
              <li>
                <button onClick={exeSignout} >Logout</button>
              </li>
            </TrueShows>
            
          </ul>

        </nav>
      </div>      

    </section>
  )
}

export default Header;