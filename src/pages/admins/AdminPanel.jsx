import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MdVerifiedUser } from 'react-icons/md';
import { GoUnverified } from 'react-icons/go';
import { FaUser } from "react-icons/fa6";
import UserOrders from './UserOrders';
import OrderView from './OrderView';
import { CiSearch } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { GrUserAdmin } from "react-icons/gr";
import { SlReload } from "react-icons/sl";


const AdminPanel = () => {
  const navigate = useNavigate();
  const adminPass = useSelector(state => state.userData.currentUserData.admin) || false; 
  const cud = useSelector(state => state.userData.currentUserData);
  const [loading, setLoading] = useState(true);

  const [userList, setUserList] = useState([]);
  const [overviewDetails, setOverviewDetails] = useState("");
  const [details, setDetails] = useState([]);

  const [orderView, setOrderView] = useState(false);
  const viewButtonStyle = "bg-white rounded-sm border-none text-maincolor px-1"; 

  // SEARCH
  const [searchList, setSearchList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const refreashSearch = (e) => {
    e.preventDefault();

    setSearchInput("");
    setSearchList([]);
    setSearchResult("")
  }

  const exeSearch = (e, input) => {
    e.preventDefault();
    if (input !== "") {
      try {
        if (userList.length !== 0) {
          let tempList = [];
          userList.forEach((take, index) => {
            if (take.basicDone) {
              if (take.displayName.toLowerCase().includes(input) || input.includes(take.displayName.toLowerCase()) || take.username.toLowerCase().includes(input) || input.includes(take.username.toLowerCase()) || take.email.toLowerCase().includes(input) || input.includes(take.email.toLowerCase())) {
                if (!tempList.includes(take)) {
                  tempList.push(take);
                }
              }
            }
            else {
              if (take.email.includes(input) || input.includes(take.email)) {
                if (!tempList.includes(take)) {
                  tempList.push(take);
                }
              }              
            }

          })

          if (tempList.length !== 0) {
            setSearchList(tempList);
            setSearchResult(`Showing ${tempList.length} ${tempList.length > 1 ? "results" : "result"} for "${input}"`);
          }
          else {
            setSearchResult("Nothing matched...")
          }
        }
      } catch (err) {
        console.error(err);
      }
    } 
    else {
      setSearchResult("Please type name/@username....");
    }
    
  }

  const exeSearchbyRoles = (e, input) => {
    e.preventDefault();
    
    if (input !== "") {
      try {
        let tempList = [];
        userList.forEach(take => {
          if (take.role.toLowerCase() === input) {
            if (!tempList.includes(take)) {
              tempList.push(take);
            }
          }
        })

        if (tempList.length !== 0) {
          setSearchList(tempList);
          setSearchResult(`Showing ${tempList.length} ${tempList.length > 1 ? "results" : "result"} for Role: ${input}`);
        }
      } catch (err) {
        console.error(err);
      }
    } 
    
  }

  const directLink = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  }

  const expandDetails = (e, uid) => {
    e.preventDefault();

    if (!details.includes(uid)) {
      setDetails(prev => [...prev, uid]);
    }
    else {
      setDetails(prev => prev.filter(item => item !== uid));
    }
  }

  const fetchData = async () => {
    try {
      const userDataSnapshot = await getDocs(collection(db, 'userData'));

      const tempList = userDataSnapshot.docs.map(doc => ({
        ...doc.data()
      }));

      setUserList(tempList);

      if (tempList.length !== 0) {

        let tempTotalSales = 0;
        let tempVatCollected = 0;
        let tempShippingFees = 0;

        let tempOrders = 0; //later
        let tempDelivered = 0;
        let tempOtw = 0;

        tempList.forEach((take, index) => {
          take.orderHistory.forEach((item, index) => {
            tempTotalSales += item.totalCost;
            tempVatCollected += item.vatCost;
            tempShippingFees += item.shippingCost;

            if (item.delivered) {
              tempDelivered++;
            } else {
              tempOtw++;
            }

          });
          tempOrders += take.orderHistory.length;
          // orderHistory closed
        });

        setOverviewDetails({
          sales: tempTotalSales,
          vatCollected: tempVatCollected,
          shippingFees: tempShippingFees,

          orders: tempOrders,
          delivered: tempDelivered,
          otw: tempOtw,          
        })
        // tempList closed
      }
    } catch (err) {
      console.error("There were some errors", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [db])

    // LOGGED IN+ADMIN ONLY PAGE
    useEffect(() => {
      const forLoggedIn = async () => {
        const unsub = onAuthStateChanged(auth, (user) => {
          if(user === null) {
            navigate("/");
          }
          else {            
            if (cud) {
              if (!cud.admin) {
                navigate("/");
              }
              else {
                setLoading(false);
              }
            }           
          }
        });
        return () => {
          unsub();
        }
      }
  
      forLoggedIn();
    }, [cud, navigate]);

    if (loading) {
      return <div>Loading...</div>; // Show loading state
    }  


  return (
    <section className={`${adminPass ? "flex" : "hidden"} w-full overflow-hidden p-1  flex-col justify-center items-center ss:max-w-[700px]`}>
      <h5 className="border border-maincolor px-3 mb-2 rounded-md">Admin's Block</h5>
      <div className="centaY">
        <p className="">Total User: {userList.length}</p>
        <div className="flex flex-col justify-center items-center p-2 border text-sm rounded-md my-2">
          <p className="text-maincolor">View Mode</p>
          <div className={`bg-maincolor p-1 border my-1 rounded-md centaX gap-1 px-2`}>
            <button className={`${!orderView ? viewButtonStyle : "text-white p-1"}`} title="View compact infos of all user at once"
            onClick={() => setOrderView(false)}
            >User Details</button>
            <button className={`${orderView ? viewButtonStyle : "text-white p-1"}`} title="View order infos of all user at once"
            onClick={() => setOrderView(true)}
            >Order Views</button>
          </div>
        </div>       
      </div>
      {!orderView ? 
        <div className="w-full overflow-hidden p-1 flex flex-col justify-center items-center">
          {/* search utils */}
          <div className="flex flex-col justify-center items-center border p-5 rounded-md">

            {/* search by inputs */}
            <div className="w-full flex flex-col justify-center items-center">

              <input type="text" className="border rounded-md border-1 h-[30px] p-1 text-gray-700 text-sm text-center w-[260px]"
              placeholder="type email / name / username"
              onChange={e => setSearchInput(e.target.value)} value={searchInput}
              onKeyDown={ e => {
                if (e.key === 'Enter') {
                  exeSearch(e, searchInput.toLowerCase())
                }
              }}          
              />

              <div className="text-sm flex justify-between items-center gap-3 my-2">           
                <button className="border border-gray-600 text-gray-600 p-1 rounded-md w-[125px] centaX gap-x-1 hover:bg-gray-100"
                onClick={e => exeSearch(e, searchInput.toLowerCase())}
                >
                  <CiSearch size={20}/> search
                </button>

                {/* <button className="border border-gray-600 text-gray-600 p-1 rounded-md w-[125px]  centaX gap-x-1" title="search by username"> <CiSearch size={20}/> @username</button> */}
              </div>

            </div>

            {/* search by roles */}
            <div className="text-maincolor text-sm">
              <p className=" mt-1 py-1 text-center border-t text-gray-700">Search by Roles</p>

              <div className="flex gap-1 flex-wrap">

                <button className="px-2 p-1 border-none bg-green-600 text-white text-xs rounded-sm" onClick={e => exeSearchbyRoles(e, "customer")}>customer</button>
                <button className="px-2 p-1 border-none bg-maincolor text-white text-xs rounded-sm" onClick={e => exeSearchbyRoles(e, "visitor")}>visitor</button>
                <button className="px-2 p-1 border-none bg-maincolor text-white text-xs rounded-sm" onClick={e => exeSearchbyRoles(e, "manager")}>manager</button>

              </div>
            </div>

            <button className="border border-gray-600 text-gray-600 p-1 mt-3 rounded-md w-[130px] gap-x-1 text-sm text-center active:bg-green-600 active:text-white hover:bg-gray-100"
            title="if search engine is not working properly, click it to refresh..."
            onClick={e => refreashSearch(e)}
            >refreash search</button>
                    
          </div>

          {/* SEARCH RESULTS */}
          <div className={`${searchResult !== "" ? "flex" : "hidden"} text-sm text-blue-600 my-2 justify-center items-center gap-1`}>
            <CiSearch size={20} /> <span>{searchResult}</span>
          </div>

          <button className="border border-gray-600 text-gray-600 p-1 mt-3 rounded-md w-[130px] gap-x-1 my-2 text-base text-center flex justify-center items-center active:bg-green-600 active:text-white hover:bg-gray-100"
          title="Reload updated data from the server"
          onClick={fetchData}
          ><SlReload /> reload data</button>

          <p className="border-none p-1 text-center bg-gray-200 text-maincolor rounded-md w-full text-sm">All the informations of users are listed below</p>

          {/* userData list */}
          <div className="w-full">
            {userList && userList.length !== 0 ?  
              <div>
                {(searchList && searchList.length !== 0 ? searchList : userList).map((take, index) => (
                  <div key={take.uid} className="my-3 p-1 border border-maincolor rounded-md text-sm flex flex-col gap-y-1">

                    {/* EMAIL & VERIFIED */}
                    <div className="flex flex-wrap items-center gap-x-1 overflow-hidden">
                      <p className="">{index+1}. {take.email}</p> 
                      <div title={take.emailVerified ? "Verified" : "Not Verified!"} className="text-green-600" >{take.emailVerified ? <MdVerifiedUser /> : <GoUnverified />}</div>

                    </div>

                    {/* ROLE & CREATETTIME */}
                    <div className="flex flex-wrap gap-x-1 justify-between">
                      <div className="flex flex-wrap gap-x-1 justify-between items-center border-none bg-gray-200 rounded-sm px-1">
                        {take.admin ? <GrUserAdmin/> : <FaUser />} <span className="text-xs border-none mt-[2px]">{take.role}</span>
                      </div>
                      <div>
                        Created: {take.createTime && take.createTime.datePlain} {take.createTime && take.createTime.timePlain}
                      </div>
                    </div>

                    {/* BASIC INFOS */}            
                    {take.basicDone ? 
                      <div className="flex flex-col border-b">
                        <div className="flex justify-between flex-wrap">
                          <p>Name: {take.displayName}</p>
                          <p>@{take.username}</p>
                          <p>{take.gender}</p>                  
                        </div>
                        <div className="flex justify-between flex-wrap">
                          <p>Born: {take.dob}</p>
                        </div>
                      </div>

                    :
                      <div>Basic Info: User has not set basic informations</div>
                    }     

                    <div className={`${details.includes(take.uid) ? "" : "hidden"}`}>

                      {/* ADDRESSES        */}
                      {take.addresses.length !== 0 ? 
                        <div className="flex flex-col flex-wrap overflow-hidden gap-y-1 border-b">
                          {take.addresses.map((item, index) => (
                            <p key={Math.random()}>Address {index+1}: {item.complete}</p>
                          ))}
                        </div>
                      :
                        <div className="border-b">User did not set any addresses</div>
                      }

                      {/* CARTS */}
                      {take.carts.length !== 0 ?
                        <div className="flex flex-col flex-wrap overflow-hidden border-b">
                          <div>Carts (Product IDs): </div>
                          <div className="flex gap-x-1 flex-wrap">
                            {take.carts.map(item => (
                              <div key={Math.random()} className="hover:underline hover:cursor-pointer text-xs"
                                onClick={e => directLink(e, item)}
                              >{item}</div>
                            ))}
                          </div>
                          
                        </div>
                      :
                        <div className="border-b">Carts (Product IDs): Empty!</div>
                      }

                      {/* LIKES */}
                      {take.likes.length !== 0 ?
                        <div className="flex flex-col flex-wrap overflow-hidden border-b">
                          <div>Likes (Product IDs): </div>
                          <div className="flex gap-x-1 flex-wrap">
                            {take.likes.map(item => (
                              <div key={Math.random()} className="hover:underline hover:cursor-pointer text-xs"
                                onClick={e => directLink(e, item)}
                              >{item}</div>
                            ))}
                          </div>
                          
                        </div>
                      :
                        <div className="border-b">Likes (Product IDs): Empty!</div>
                      }

                      {/* USER ORDERS SECTION */}
                      {take.orderHistory && take.orderHistory.length !== 0 ? 
                        <UserOrders key={take.uid} orders={take.orderHistory} uid={take.uid} />
                      :
                        <div>No orders made</div>
                      }
                    </div>
                    
                    <div className="flex justify-end px-2 m-1">

                      {/* <button className="border-none rounded-sm bg-red-600 text-white px-1"
                      onClick={(e) => exeDeleteOne(e, take.uid)}
                      >Delete</button> */}

                      <button className="border-none rounded-sm bg-green-600 text-white px-1" 
                        onClick={(e) => expandDetails(e, take.uid)}
                      >
                        {details.includes(take.uid) ? "Collapse" : "Expand Details"}
                      </button>

                    </div>
                  </div>          
                ))}
              </div>
            :
              <div className="w-full text-center my-5 text-gray-600">
                {userList || userList.length !== 0 ? "Please wait . . ." : "There are no users..."}
              </div>
            }
          </div>
        </div>
        // ENDS HERE 
      :
        // ORDERVIEW STARTS HERE
        <div className="w-full">
          {userList && userList.length !== 0 ?
            <div>
              <div className="border rounded-md my-1">
                <p className="border-b text-center">Overview of Orders (Total)</p>
                
                {Object.keys(overviewDetails).length !== 0 ?
                  <div className="text-sm p-1 flex flex-col gap-y-1">
                    {/* <p>Sales: ${overviewDetails.sales}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row">
                      <p className="">Sales</p>
                      <p>: ${(overviewDetails.sales).toFixed(2)}</p>
                    </div>

                    {/* <p>Vat Collected: ${overviewDetails.vatCollected}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row">
                      <p className="">Vat Collected</p>
                      <p>: ${(overviewDetails.vatCollected).toFixed(2)}</p>
                    </div>

                    {/* <p>Shipping Fees: ${overviewDetails.shippingFees}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row border-b pb-1">
                      <p className="">Shipping Fees</p>
                      <p>: ${(overviewDetails.shippingFees).toFixed(2)}</p>
                    </div>

                    {/* <p>{overviewDetails.orders}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row">
                      <p className="">Orders Made</p>
                      <p>: {overviewDetails.orders}</p>
                    </div>

                    {/* <p>{overviewDetails.delivered}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row">
                      <p className="">Delivered</p>
                      <p>: {overviewDetails.delivered}</p>
                    </div>

                    {/* <p>{overviewDetails.otw}</p> */}
                    <div className="grid grid-cols-[150px_1fr] grid-flow-row">
                      <p className="">Not Received by User</p>
                      <p>: {overviewDetails.otw}</p>
                    </div>
                    
                  </div>
                :
                  <div  className="text-sm p-1 flex flex-col gap-y-1">...</div>
                }                
              </div>
              <p className="border-none p-1 text-center bg-gray-200 text-maincolor rounded-md w-full mt-3 text-sm">Users who made orders will only be shown here</p>

              {userList.map((take, index) => (
                take.orderHistory.length !== 0 ?                   
                  <OrderView key={take.uid} orders={take.orderHistory} user={take} uid={take.uid} serial={index + 1}/>
                  
                :
                  null            
              ))}
            </div>
          :
            <div className="text-center text-gray-700">
              {userList || userList.length !== 0 ? "Please wait..." : "No Users..."}
            </div>
          }
        </div>
      }
    </section>
  )
}

export default AdminPanel