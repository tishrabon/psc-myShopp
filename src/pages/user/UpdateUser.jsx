import React, { useEffect, useState } from 'react';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, deleteUser, GoogleAuthProvider } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, userDataSelector } from '../../redux/slice/userDataSlice';
import { updateBASICINFO, storeADDRESS, deleteADDRESS } from '../../redux/slice/userDataSlice';
import { useNavigate } from 'react-router-dom';

// aug18 morning0657 ***
const UpdateUser = () => {

  const updateStyle = {
    welcome: `p-3 centaY rounded-[10px] bg-green-600 text-white flex-wrap my-2 w-[90%]`,
    forma: `flex flex-col justify-between items-start gap-y-3 resmenu-shadow p-5 rounded-[10px] w-[90%]`,
    gapX2: `flex flex-row gap-x-3 items-center`,
    gapX: `grid grid-cols-[80px_1fr] text-sm items-center`,

    gapXX2: `flex flex-row gap-x-3 items-start`,
    gapXX: `grid grid-cols-[80px_1fr] text-sm`,

    usernames: `flex flex-col gap-y-2`,
    
    inputa: `border-[1px] bg-gray-100 p-1 m-1 rounded-[5px] w-[200px] ss:w-[250px] sm:w-[320px]`, 

    inputaMini: `border-[1px] bg-gray-100 p-1 m-1 rounded-[5px] w-[150px] ss:w-[200px]`,
    
    inputaLtd: `border-[1px] bg-gray-100 p-1 m-1 rounded-[5px] w-[150px] ss:w-[200px]`,

    button: `bg-green-600 text-white rounded border-none px-4 py-1 mt-4`,
    button2: `bg-gray-300 mt-[60px] m-1 p-1 rounded-md w-[60px]`,
    button3: `bg-green-300 m-1 p-1 rounded-md`,

    addressSection: `grid grid-rows-[30px_1fr] gap-y-1 overflow-hidden w-[100%] text-sm border p-1 rounded-md`, 
    addressButton:`border-none rounded-sm bg-white px-1 mr-2`,

    inputLabels: `bg-gray-300 p-1 rounded-md flex justify-between`,    
    inputSection: `flex flex-col relative h-[270px]`,
    inputBranch: `flex flex-row my-2 ml-1`,
    adressInputs: `border border-gray-300 rounded-md border-1 w-[130px] sm:w-[150px] md:w-[200px] absolute left-[80px] h-[30px] p-1`,
    adressInputsTA: `border border-gray-300 rounded-md border-1 w-[130px] sm:w-[150px] md:w-[200px] absolute left-[80px] mb-1 p-1`, 

    showAddressBox: `grid grid-rows-[30px_1fr] gap-y-1 overflow-hidden w-[100%] text-sm border p-1 rounded-md`,
    showAddressLabel: `bg-gray-300 p-1 rounded-md flex justify-between`,
    showAddressButton: ``,

  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allData = useSelector(state => state.userData.currentUserData) || {};
  const addresses = allData.addresses || [];

  const [name, setName] = useState(allData.displayName || null);
  const [dob, setDob] = useState(allData.dob || null);
  const [gender, setGender] = useState(allData.gender || null);
  const [username, setUsername] = useState(allData.username || null);
  const [unAvail, setUnAvail] = useState("[mandatory] Check whether username is available or not");
  const [usernamePass, setUsernamePass] = useState(null);

  // DELETE USER ACCOUNT
  const [deletePass, setDeletePass] = useState(false);
  const [confirmPsw, setConfirmPsw] = useState(false);
  const [deletePsw, setDeletePsw] = useState("");
  
  // ADDRESS SECTOR YALL
  const [onePass, setOnePass] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [maxAddress, setMaxAddress] = useState("");

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [zipcode, setZipcode] = useState(null);
  const [details, setDetails] = useState(null);
  const [def, setDef] = useState(null);

  const checkUsername = async (e, data) => {
    e.preventDefault();
    try {
      if (data) {
        const docRef = collection(db, "userData");
        const que = query(docRef, where('username', '==', data));
        const querySnapshot = await getDocs(que);
    
        if (querySnapshot.empty) {
          setUnAvail("Great! It's available");
          setUsernamePass(true);
          return true;
        } else {
          setUnAvail("Oops! Already taken. Please find another one.");
          setUsernamePass(false);
          return false; 
        }
      }
      else {
        setUnAvail("username input is empty!");
      }
      
    } 
    catch (error) {
      console.error(error);
    }
    
  } 

  const exeSubmit = (e) => {
    e.preventDefault();
    try {
      if (allData.basicDone == false) {
        if (name !== null && gender !== null && dob !== null && username !== null) {
          dispatch(
            updateBASICINFO({
              pass: "basic",
              uid: allData.uid,
              basicLabel: allData.createdBy,
              displayName: name,
              username: username,
              gender: gender,
              dob: dob
            })
          );
          setName("");
          setUsername("");
          setGender("");
          setDob("");
        }
      }
      else if (allData.basicDone == true) {
        dispatch(
          updateBASICINFO({
            pass: "nameOnly",
            uid: allData.uid,
            displayName: name,
          })
        );
        setName("");
      }
      dispatch(
        fetchUserData(allData.uid)
      )
      navigate("/user");
    }
    catch (err) {
      console.error(err);
    }    

  }

  const proceedAddressInput = (e) => {
    e.preventDefault();
    if (allData.addresses.length < 3) {
      setCountry("");
      setState("");
      setDistrict("");
      setZipcode("");
      setDetails(""); 
      setEditPass(prev => !prev);
    } else {
      setMaxAddress("You can not add more than 3  addresses!");
    }
  }

  const saveAddress = (e) => {
    e.preventDefault();
    try {
      if (country !== "" && state !== "" && district !== "" && zipcode !== "" && details !== "") {
        const address = {
          country: country,
          state: state,
          district: district,
          zipcode: zipcode,
          details: details,
          complete: `${details}, Zipcode: ${zipcode}, District: ${district}, State: ${state}, Country: ${country}`,
          id: Date.now()          
        }

        dispatch(
          storeADDRESS({
            address: address
          })
        );

        setCountry("");
        setState("");
        setDistrict("");
        setZipcode("");
        setDetails(""); 
        
        setMaxAddress("");
        setEditPass(false);

      } else {
      }
    } catch (err) {
      console.error(err);
    }
    
  }

  const deleteAddress = (e, index) => {
    e.preventDefault();
    dispatch(
      deleteADDRESS({
        index: index
      })
    );
    setMaxAddress("");
  }

  const exeDeleteEmailnPsw = async (e, deletePsw) => {
    e.preventDefault();
    if (deletePsw) {
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(allData.email, deletePsw);
                
        // REAUTHING... ACCOUNT
        await reauthenticateWithCredential(user, credential);
        
        // DELETING USERDATA
        await deleteDoc(doc(db, "userData", allData.uid));

        // DELETING AUTH/ACCOUNT
        await user?.delete();

        alert("User Account Has been deleted!");

        window.location.href = "/";
      } catch (err) {
        console.error(err);
        alert(err);
      }

    }
  }

  const exeDeleteGooglepopup = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const providerGoogle = new GoogleAuthProvider();

      // REAUTHING... ACCOUNT
      await reauthenticateWithPopup(user, providerGoogle);

      // DELETING USERDATA
      await deleteDoc(doc(db, "userData", allData.uid));

      // DELETING AUTH/ACCOUNT
      await user?.delete();

      alert("User Account Has Been Deleted!");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
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
    <section className="centaY w-[370px] xs:w-[400px] ss:w-[450px] sm:w-[550px]"> 

      <div className={`${updateStyle.welcome}`}>Update Your Basic Informations Here </div>

      {/* onSubmit later, remember, aight? */}
      <form className={updateStyle.forma} onSubmit={exeSubmit}> 

        <div className={`flex-wrap w-[95%] text-sm centaY mb-3 border-b pb-2`}>
          {allData.basicDone ? <div className="text-green-800">You completed your basic information update. username, d.o.b and gender cannot be changed since you already changed them once.</div> 
          :
          <div className="text-red-800">Please update your basic Informations. username, date of birth and gender can only be changed once!</div>
          }
        </div>

          {/* NAME */}
          <div className={`${updateStyle.gapX}`}>        
            <label className="text-green-800" htmlFor="name">Name</label> 
            <input
              className={`${updateStyle.inputa}`} type="text" id="name"
              placeholder={name} onChange={e => setName(e.target.value)}
            />                               
          </div> 

          {/* USERNAME */}
            {allData.basicDone ? 
                <div className={`${updateStyle.gapX}`}>        
                  <span className="text-green-800">username</span> 
                  <span>
                    : {allData.username || "...loading"}
                  </span>                                
                </div>               
              : 
                <div className={updateStyle.gapXX}>

                  <label htmlFor="username" className="text-green-800 mt-[5px]">username</label> 

                  <div className="flex flex-col items-start">
                    <input 
                      className={`${updateStyle.inputaMini}`} id="username" type="text" placeholder="" maxLength="10"
                      onChange={e => setUsername((e.target.value).toLowerCase())}
                    />  

                    <div className="centaX my-1 flex flex-row items-start">

                      <button className="ml-1 p-1 border-none rounded-md text-xs bg-red-600 text-white" 
                      onClick={(e) => checkUsername(e, username)}
                      >Click</button>

                      <p className="mx-1 text-xs text-red-500">{unAvail}</p>
                    </div>
                  </div>
                  
                </div> 
                // null
            }           

          {/* EMAIL */}
          <div className={`${updateStyle.gapX}`}>        
            <span className="text-green-800">Email</span> 
            <span>
              : {allData.email || "...loading"}
            </span>                                
          </div> 

          {/* DATE OF BIRTH */}
          {allData.basicDone ? 
              <div className={`${updateStyle.gapX}`}>        
                <span className="text-green-800">Born</span> 
                <span>
                  : {allData.dob || "...loading"}
                </span>                                
              </div>
            : 
              <div className={`${updateStyle.gapX}`}>        
                <label htmlFor="dob" className="text-green-800">Born</label> 
                <input 
                  className={`${updateStyle.inputaLtd}`} id="dob" type="date" 
                  onChange={e => setDob(e.target.value)}
                />                                
              </div>
          } 

          {/* GENDER */}
          {allData.basicDone ?
            <div className={`${updateStyle.gapX}`}>        
              <span className="text-green-800">Gender</span> 
              <span>
                : {allData.gender || "...loading"}
              </span>                                
            </div>
          :
            <div className={`${updateStyle.gapX}`}>        
              <label htmlFor="gender" className="text-green-800">Gender</label> 
              <select 
                className={`${updateStyle.inputaLtd} `} name="gender" id="gender"
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>  
                <option value="female">Female</option>
              </select>                             
            </div> 
          }
          
          <p className="text-xs text-red-600">{!allData.basicDone ? "* You must fill-up name, username, born & gender" : null}</p>
          <button className={updateStyle.button} type="submit">Confirm Updates</button>

      </form> 


      {/* FORM TWO */}
      <div className={`${updateStyle.welcome}  mt-7`}>Your Address</div>
      <form className={`${updateStyle.forma}`}>
        {/* SAVED ADDRESSES TO BE SHOWED HERE */}

        { allData.addresses && allData.addresses.length !== 0 ?
          (
            allData.addresses.map((take, index) => {
              return (
                <div key={take.id} className={`${updateStyle.addressSection}`}>          
                  <div className={updateStyle.showAddressLabel}>
                    <p>Address {index+1}</p> 
                    { allData.addresses.length !== 1 ?
                      <button className={`${updateStyle.addressButton} text-red-700`} onClick={e => deleteAddress(e, index)}>Delete</button>
                    :
                      <div></div>
                    }                    
                  </div>
                  <p>{take.complete}</p>             
                </div>
              )
            })
          )         
        :
          <div className="text-[15px] mx-2 text-center w-full text-red-600">No Addresses Saved Yet (Maximum 3)</div>
        }        

        {/* ADDRESS INPUT BELOW */}
        <div className={`${updateStyle.addressSection}`}>
          <div className={updateStyle.inputLabels}>
            <p>Add Address</p>
           
            <button 
              onClick={(e) => {proceedAddressInput(e)}}
              className={`${updateStyle.addressButton} text-green-900`}
            >
              { editPass ? "Collapse" : "Proceed" }
            </button>            

          </div>

          {/* ADDRESS INPUT PROCESS INITIATES HERE */}
          { editPass ? 
          <div className={updateStyle.inputSection} >
    
            {/* COUNTRY */}
            <div className={updateStyle.inputBranch}>
              <label htmlFor="country">Country:</label>
              <input id="country" name="country" type="text" className={`${updateStyle.adressInputs}`} onChange={e => setCountry(e.target.value)} placeholder={country || "e.g. Bangladesh"}/>
            </div>

            {/* STATE */}
            <div className={updateStyle.inputBranch}>
              <label htmlFor="state">State:</label>
              <input id="state" name="state" type="text" className={`${updateStyle.adressInputs}`} onChange={e => setState(e.target.value)} placeholder={state || "e.g. Khulna"}/> 
            </div>

            {/* DISTRICT */}
            <div className={updateStyle.inputBranch}>
              <label htmlFor="district">District:</label>
              <input id="district" name="district" type="text" className={`${updateStyle.adressInputs}`} onChange={e => setDistrict(e.target.value)} placeholder={district || "e.g. Kushtia"}/> 
            </div>  

            {/* ZIPCODE */}
            <div className={updateStyle.inputBranch}>
              <label htmlFor="zipcode">Zipcode:</label>
              <input id="zipcode" name="zipcode" type="number" className={`${updateStyle.adressInputs}`} onChange={e => setZipcode(e.target.value)} placeholder={zipcode || "e.g. 0007"}/> 
            </div>          

            {/* DETAILS */}
            <div className={updateStyle.inputBranch}>
              <label htmlFor="details">Details:</label>
              <textarea id="details" name="details" type="text" rows="3" cols="10" placeholder={details || "e.g. House-12, Road-02, Block-B"} className={`${updateStyle.adressInputsTA}`} onChange={e => setDetails(e.target.value)} /> 
            </div>

            {/* SAVE BUTTON */}
            <button onClick={saveAddress} className={updateStyle.button2}>Save</button>

          </div> 
          :
          <div className="">{maxAddress}</div>
          }

        </div>                
      </form>

      {/* DELETE - GOTTA LET THE USER GO YALL! */}
      <div className="w-[90%] flex justify-center items-center my-5 mb-20 px-3">
        <button className={`text-red-600 text-center text-sm ${!deletePass ? "" : "hidden"}`} 
          onClick={() => {setDeletePass(true)}}
        >
          Delete Account?
        </button>   

        <div className={`${deletePass ? "" : "hidden"} w-full flex-col justify-center items-center border-none rounded-md m-3 text-center box-shadow`}>

          <p className={`px-1 py-2 bg-red-600 text-[16px] text-white rounded`}>Confirm Delete Process?</p> 
          
          <p className={`text-gray-700 m-2 p-3 border-none bg-gray-200 rounded-md text-sm`}>[Dev's Word] This is my first complete project and of course its not perfect! But still, I would like to hope that you enjoyed my project! If not then please let me! It would be helpful for me to do better in future. Good Luck! - T.I. Shrabon</p>

          <p className={`text-gray-800 m-2 text-[15px] my-5 px-5`}>Are You Sure? Once You delete, You cannot recover your account!</p>

          <div>
            <input type="password" className={`${confirmPsw && allData.createdBy === "emailnpsw" ? "" : "hidden"} w-[170px] border border-red-500 rounded-md mb-3 p-1`}
            onChange={e => {setDeletePsw(e.target.value)}}
            />
          </div>

          {/* CREATED BY EMAIL AND PASSWORD DELETION SECTION */}
          <div className={`${allData.createdBy === "emailnpsw" ? "" : "hidden"} flex justify-center items-center gap-5 mb-3`}>

            <button className={`w-[100px] border-none rounded-md bg-green-600 text-white px-1`} onClick={() => {setDeletePass(false); setConfirmPsw(false); setDeletePsw("")}}>Cancel</button>

            {!confirmPsw ? 
              <button className={`w-[100px] border-none rounded-md bg-red-600 text-white px-1`} 
              onClick={() => {setConfirmPsw(true)}}
              >
                Proceed
              </button>
            : 
              <button className={`w-[100px] border-none rounded-md bg-red-600 text-white px-1`} 
                onClick={(e) => {exeDeleteEmailnPsw(e, deletePsw)}}
              >
                Confirm
              </button>
            }

          </div>

          {/* CREATED VIA GOOGLE POPUP DELETION SECTION */}          
          <div className={`${allData.createdBy === "googlepopup" ? "" : "hidden"} flex justify-center items-center gap-5 mb-3`}>
            
            <button className={`w-[100px] border-none rounded-md bg-green-600 text-white px-1`} onClick={() => {setDeletePass(false); setConfirmPsw(false)}}>Cancel</button>

            {!confirmPsw ? 
              <button className={`w-[100px] border-none rounded-md bg-red-600 text-white px-1`} 
              onClick={() => {setConfirmPsw(true)}}
              >
                Proceed
              </button>
            : 
              <button className={`w-[100px] border-none rounded-md bg-red-600 text-white px-1`} 
                onClick={exeDeleteGooglepopup}
              >
                Confirm?
              </button>
            }

          </div>

        </div>    
      </div>
    </section>

  )

}

export default UpdateUser;