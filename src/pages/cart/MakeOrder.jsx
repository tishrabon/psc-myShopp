import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearORDERINGS, initORDER, confirmORDER } from '../../redux/slice/userDataSlice';

// seems good++ copy 13
export const MakeOrder = () => {

  const styles = {
    box: `flex flex-col w-full justify-between items-center mt-4 px-2`,
    subBox: `flex flex-row w-full`,
    others: `flex flex-col w-[60%] border rounded-md m-1 p-1 text-[14px]`,
    cash: `w-[40%] border rounded-md m-1 p-1`,
    makeOrderButton :`border-none bg-green-600 text-white px-2 py-1 rounded-sm mt-2 mr-4 w-[full] text-md`,
    clearButton: `border-none bg-red-600 text-white px-2 py-1 rounded-sm mt-2 mr-4 w-[full] text-md`,
    finalStage: `w-[99%] m-2 border rounded-md text-[14px] p-1`,
    finalSections: `my-1 text-[13px] mx-3`,
    farewell: `w-full border-none rounded-md box-shadow m-[20px] `,
    farewellWords: `my-1 text-[14px] mx-3 p-1`

  }
  const dispatch = useDispatch();

  const orderings = useSelector(state => state.userData.orderings);
  const addresses = useSelector(state => state.userData.currentUserData.addresses) || [];

  const [productCost, setProductCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(5);
  const [vat, setVat] = useState(7);
  const [total, setTotal] = useState(0);
  const [addressTemp, setAddressTemp] = useState();

  const [order, setOrder] = useState(false);  
  const [confirmed, setConfirmed] = useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(
    useSelector(state => state.userData.deliveryDays)
  );

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  }

  const vatPrice = (price, vat) => {
    return ((price * vat) / 100);
  }

  const clear = (e) => {
    e.preventDefault();
    setProductCost(0);
    setTotal(0);
    setOrder(false);

    dispatch(clearORDERINGS());

    if(confirmed) {
      setConfirmed(false);
    }
    
  }
  
  const addZero = (str) => {
    let string = "";
    if (str.length < 2) {
      string = "0" + str;     
    } else {
      string = str;      
    }    
    return string;
  }

  const initOrder = (e) => {
    e.preventDefault();
    if (orderings.products.length !== 0) {
      setOrder(prev => !prev);   
      setAddressTemp(addresses[addressIndex].complete);
      
      dispatch(
        initORDER()
      );
    }
  }

  const confirmOrder = async (e) => {
    e.preventDefault();

    // NEW EXODUS OF DATA
    //  SETTING DATE YALL
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setMinutes(orderDate.getMinutes() + deliveryDays);

    //  SETTING PLAIN TEXT FORMAT OF DATE FOR INEXPENSIVE EXECUTIONS
    const orderDatePlain = addZero(String(orderDate.getDate())) + "-" + addZero(String(orderDate.getMonth() + 1)) + "-" + String(orderDate.getFullYear());

    const deliveryDatePlain = addZero(String(deliveryDate.getDate())) + "-" + addZero(String(deliveryDate.getMonth() + 1)) + "-" + String(deliveryDate.getFullYear());

    //  SETTING TIMES IN PLAIN TEXT YALL
    const orderTimePlain = addZero(String(orderDate.getHours())) + ":" + addZero(String(orderDate.getMinutes()));
    const deliveryTimePlain = addZero(String(deliveryDate.getHours())) + ":" + addZero(String(deliveryDate.getMinutes()));

    //FINDING THE AVERAGE RATING OF THE PRODUCTS TO BE ORDERED, HAHA
    let rating = 0;
    orderings.products.map(take => {
      rating += take.rating;
    })
    const averageRating = parseFloat((rating/orderings.products.length).toFixed(1));

    const demo = {
      totalCost: total,
      shippingCost: shippingCost,
      vat: vat,
      vatCost: parseFloat((vat === 0 ? 0 : vatPrice(productCost, vat)).toFixed(2)),
      id: Date.now(),

      orderDate: orderDate.toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      deliveryDays: deliveryDays,
      orderDatePlain: orderDatePlain,
      deliveryDatePlain: deliveryDatePlain,
      orderTimePlain: orderTimePlain,
      deliveryTimePlain: deliveryTimePlain,

      address: addresses[addressIndex],
      addressMini: addresses[addressIndex].complete,
      averageRating: averageRating,
      onTheWay: false,
      delivered: false,
      products: orderings.products, 
    };

    dispatch(
      confirmORDER({demo})
    );
    
    // clear(e);
    // ALTERNATIVE TO CLEAR EXCEPT REDUX STATE
    setProductCost(0);
    setTotal(0);
    setOrder(false);

    setConfirmed(true);
  }
  
  const changeAddress = (e) => {
    e.preventDefault();
    if (addressIndex < addresses.length - 1) {      
      setAddressIndex(addressIndex + 1)
    } else {
      setAddressIndex(0);
    }
  }

  // WORKING YALL
  useEffect(() => {
    if (orderings.products.length !== 0) {
      if (orderings.products) {
        
        let tempTotal = 0;
        orderings.products.map(take => {
          const price = (take.discount ? (parseFloat(discountPrice(take.price, take.discount).toFixed(2)) * take.quantity) : parseFloat((take.price).toFixed(2)) * take.quantity)
          tempTotal += price;
        });
        setProductCost(tempTotal);
        setTotal(parseFloat((tempTotal + shippingCost + parseFloat((vat === 0 ? 0 : vatPrice(tempTotal, vat)).toFixed(2))).toFixed(2)));

      }
    } 
    
  }, [orderings]);

  return (
    <section className={styles.box}>
    
      <div className={styles.subBox}>
        {/* OTHER SECTION */}
        {orderings && orderings.products.length !== 0 ? 
          <div className={styles.others}>
            <p className="px-2 mb-2">Click the address below to change your shipping address</p>   

            {order ? 
              <button className="bg-gray-200 p-1 text-[13px] rounded-md">
                Address {addressIndex+1}: {addresses[addressIndex].complete}
              </button> 
            :
              <button className="bg-gray-200 p-1 text-[13px] rounded-md" onClick={e => changeAddress(e)}>
                Address {addressIndex+1}: {addresses[addressIndex].complete}
              </button> 
            }
            

            <p className="text-[12px] px-2 my-2">To be delivered in {deliveryDays} minuts. Developer reduced days into minutes so that recruiters can check whether delivery status is updating automatically or not. 2 Minutes (days!) after confirming order, Status will be updated to "On The Way".</p>            

          </div>
        :
          <div className={styles.others}>
            <span>You didn't proceed any order yet</span>
          </div>
        }     

        {/* CA$H MONEY SECTION */}
        <div className={styles.cash}>
          <div className="m-1 flex flex-col gap-y-1">
            <p className="text-sm">Product: ${(productCost.toFixed(2))}</p>
            <p className="text-sm">Shipping: ${shippingCost}</p>
            <p className="text-sm">Vat: {vat !== 0 ? <>${(vatPrice(productCost, vat)).toFixed(2)} ({vat}%)</> : <>$0</>}</p>        

            <p className="mt-3">Total: ${total}</p>
          </div>                  
        </div> 
           
      </div>

      <div className={`${order ? "" : "hidden" } flex justify-between`}>
        <div className={styles.finalStage}>
          <div className="w-full bg-gray-200 border-none rounded-md p-1 mb-2">Overview of the Order</div>
          <p className={styles.finalSections}>Total Cost: ${total}</p>        
          <p className={styles.finalSections}>Delivery: After 7 Minutes</p>
          <p className={styles.finalSections}>Shipping Address: {addressTemp}</p>
          {/* <p className={styles.finalSections}>Average Ratings: {orderings.averageRating}</p> */}
          <p className={styles.finalSections}>Please Check before you confirm your order! If you want to change your order you need to clean first.</p>
          {/* <p className={styles.finalSections}>Time! {orderings.orderTimePlain}</p>
          <p className={styles.finalSections}>Time! {orderings.deliveryTimePlain}</p> */}
        </div>              
      </div>

      {orderings && orderings.products.length === 0 && confirmed ? 
      <div className={styles.farewell}>

        <p className="w-full bg-green-600 text-white border-none rounded-md p-2 mb-2 text-center">CONGRATULATION!</p>

        <p className={styles.farewellWords}>Your order has been confirmed! Dev is very grateful to have you this far!</p>

        <p className={styles.farewellWords}>You can go to <Link className="text-green-700" to="/orderhistory">Order History</Link> page to check updates on your order. Huge thanks from the Dev! Please clear if you want to order more.</p>

      </div> 
      :
        ""
      } 

      <div className={`flex justify-end w-full`}>
        <button className={styles.clearButton} onClick={clear}>Clear</button>
        <div className={`${ confirmed ? "hidden" : "" }`}>
          {order ? 
            <button className={styles.makeOrderButton} onClick={confirmOrder}>Confirm Order</button> 
          :
            <button className={styles.makeOrderButton} onClick={initOrder}>Proceed Order</button> 
          }
          </div>        
      </div>      
                  
    </section>
  )
}
