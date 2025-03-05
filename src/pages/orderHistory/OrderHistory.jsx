import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteORDERS } from '../../redux/slice/userDataSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {

  const styles = {
    section: `flex flex-col justify-center items-center max-w-[600px] w-full overflow-hidden`,
    head: `p-2 mb-3 w-[95%] border-none bg-green-600 rounded-md text-center text-white`,
    block: `px-2 w-[95%]`,  
    orderList: `p-2 mb-3 box-shadow rounded-md flex flex-col gap-y-2`,
    button: `px-1 border-none rounded text-white text-sm`, 
    overview: `border-none box-shadow w-[92%] rounded-md mb-5 p-1 text-center flex flex-row`
  }  

  const myOrders = useSelector(state => state.userData.currentUserData.orderHistory) || [];
  const pendingOrder = useSelector(state => state.userData.currentUserData.pendingOrders) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [details, setDetails] = useState(0);
  const [removeId, setRemoveId] = useState(0);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalVat, setTotalVat] = useState(0);

  const directLink = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  }

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  }

  const vatPrice = (price, vat) => {
    return ((price * vat) / 100);
  }

  const showDetails = (e, id) => {
    e.preventDefault();
    
    if (id === details) {
      setDetails(0);
    } else {
      setDetails(id);
    }
  }

  const initRemove = (e, id) => {
    e.preventDefault(); 
    setRemoveId(id);
  }

  const exeDeleteOrder = (e, id) => {
    e.preventDefault();
    setRemoveId(0);
    let tobeDeleted;
    
    for (const take of myOrders) {
      if (take.id === id) {
        tobeDeleted = take;
        break;  
      }
    }

    dispatch(
      deleteORDERS({tobeDeleted})
    );
    
  }

  // LOGGED IN ONLY PAGE
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
  }, []);

  useEffect(() => {
    let tempTotal = 0;
    let tempTotalVat = 0;

    if (myOrders.length !== 0) {

      myOrders.forEach(take => {
        tempTotal += take.totalCost;
        tempTotalVat += take.vatCost;
      });
      
    }

    setTotalSpent(parseFloat((tempTotal).toFixed(2)));
    setTotalVat(parseFloat((tempTotalVat).toFixed(2)));

  }, [myOrders])



  return (
    <section className={styles.section}>
      {/* OVERVIEW */}
      <h5 className={styles.head}>Overviews (Total)</h5>

      <div className={`${styles.overview}`}>
        <div className={`w-[49%] m-1 text-sm pr-1 flex flex-col justify-start items-center gap-y-2`}>
          <span>Amount Spent: ${totalSpent}</span>
          <span>Vat Paid: ${totalVat}</span>
        </div>

        <div className={`w-[51%] m-1 text-sm border-l pl-1 flex flex-col justify-start items-center gap-y-2`}>
          <span>Orders Made: {myOrders && myOrders.length}</span>
          <span>On The Way: {pendingOrder && pendingOrder.length}</span>
        </div>
      </div>

      {/* ORDER LIST */}
      <h5 className={styles.head}>My Orders</h5>      
      {myOrders && myOrders.length !== 0 ? 
        <div className={styles.block}>            

          {myOrders.slice().reverse().map((take) => {
            return (
              <div key={take.id} className={styles.orderList}>

                {/* BASIC VIEW */} 
                <div className="flex flex-row justify-between">
                  <div className="startYcenta text-sm gap-y-1">
                    <p>Total Cost: ${take.totalCost}</p>
                    <p>Shipping: ${take.shippingCost}</p>
                    <div>
                      {take.vat !== 0 ? 
                        <p>
                          Vat: ${take.vatCost} ({take.vat}%) 
                        </p>
                      :
                        <p>
                          Vat: {take.vat}%
                        </p>
                      }
                    </div>                                     
                  </div>
                  <div  className="startYcenta text-sm gap-y-1">

                    <p>Ordered: {take.orderDatePlain} {take.orderTimePlain}</p> 

                    <p>Delivery: {take.deliveryDatePlain} {take.deliveryTimePlain}</p>
                    
                    {/* DELIVERY STATUS */}
                    <div>
                      {take.delivered ? 
                        <p>Status: Delivered</p>
                      :
                        <div>
                          {take.onTheWay ? 
                            <p>Status: On The Way...</p>
                          :
                            <p>Status: Processing...</p>
                          }
                        </div>
                      }
                    </div>  

                  </div>
                </div>
                {/* <div>{take.id}</div> */}

                {/* ORDERED PRODUCTS MAP */}
                <div className="box-shadow rounded-md px-2 py-1 text-sm">
                  <span>{take.products.length === 1 ? "Product: " : "Products: "}</span>
                  
                  {take.products.map(item => {
                    return(
                      <span key={item.id}>
                        {details !== take.id ? 
                          <span className="text-[13px]">{item.name} ({item.quantity}) </span>
                        :
                          <div className="text-[13px] bg-gray-200 border-none rounded-md m-1 p-1 grid grid-cols-[2fr_2fr_.3fr] justify-around items-center"> 
                         
                            <p className="hover:underline hover:text-gray-500 decoration-gray-500 hover:cursor-pointer"
                            onClick={e => directLink(e, item.id)}
                            >{item.name} ({item.quantity})</p>
                            {/* <p></p> */}
                            {/* PRICE */}
                            <div>
                              {item.discount ?
                                <p>${(parseFloat(discountPrice(item.price, item.discount)) * item.quantity).toFixed(2)} ({item.discount}% Off)</p>
                              :
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                              }
                            </div>
                            <p>{item.rating}*</p>

                          </div>
                        }
                      </span>
                    )
                  })}
                </div>

                <p className={`${details === take.id ? "" : "hidden"} text-sm text-center my-1`}>Delivery Address: {take.addressMini}</p>
                {/* regular buttons */}
                <div className={`${removeId === take.id ? "hidden" : ""}`}>
                  <div className="betXcenta px-3">
                    <button className={`${styles.button} bg-red-500`} onClick={(e) => initRemove(e, take.id)}>
                      {take.delivered ? "Remove" : "Cancel Order"}
                    </button>

                    <button className={`${styles.button} bg-green-600`} onClick={(e) => showDetails(e, take.id)}>
                      {take.id === details ? "Collapse" : "Show Details"}
                    </button>
                  </div>                  

                </div>

                {/* DELETE */}
                <div className={`${removeId === take.id ? "" : "hidden"} flex justify-center items-center`}>
                  
                  <div className=" border flex flex-col justify-center items-center p-2 rounded-md gap-y-2">
                    <p className="text-red-800 text-[15px]">{take.delivered ? "Are You Sure?" : "Cancel This Order?"}</p>
                    <div>
                      <button className="text-sm text-white bg-green-600 rounded-md px-2 py-1 mx-4 w-[100px]" onClick={() => setRemoveId(0)}>Go Back</button>

                      <button className="text-sm text-white bg-red-600 rounded-md px-2 py-1 mx-4 w-[100px]" onClick={(e) => exeDeleteOrder(e, take.id)}>{take.delivered ? "Delete" : "Cancel Order"}</button>
                  </div>
                    </div>                  
                </div>
                              
              </div>
            )
          })}

        </div>
      :
        <div className={styles.block}>
          <p className="text-center p-1 text-gray-600">You didn't make any orders yet!</p>
        </div>
      }
      

    </section>
  )
}

export default OrderHistory;