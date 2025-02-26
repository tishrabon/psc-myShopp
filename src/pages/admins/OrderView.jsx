import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { FaFemale } from "react-icons/fa";
import { FaMale } from "react-icons/fa";


const OrderView = ({orders, user, uid, serial}) => {
  const navigate = useNavigate();

  const [ordersDetails, setOrderDetails] = useState([]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [ontheway, setOntheway] = useState(0);

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

  const seeOrders = (e, id) => {
    e.preventDefault();
    if (!ordersDetails.includes(id)) {
      setOrderDetails(prev => [...prev, id]);
    }
    else {
      setOrderDetails(prev => prev.filter(item => item !== id));
    }
  }


  useEffect(() => {
    let tempTotal = 0;
    let tempTotalVat = 0;
    let tempOtw = 0;

    orders.forEach(take => {
      tempTotal += take.totalCost;
      tempTotalVat += take.vatCost; 

      if (!take.delivered) {
        tempOtw++;
      }
    });

    setTotalSpent(parseFloat((tempTotal).toFixed(2)));
    setTotalVat(parseFloat((tempTotalVat).toFixed(2)));

    if (tempOtw !== 0) {
      setOntheway(tempOtw);
    }

  }, [orders])

  return (
    <section className="text-xs p-2 border border-maincolor my-4 rounded-md">

      <div className="flex justify-between items-center flex--wrap">
        <p className="text-sm text-center">{serial}. {user.email}</p>
        <p>Joined: {user.createTime.datePlain}</p>
        <div className="centaX gap-x-1"> {user.admin ? <GrUserAdmin/> : <FaUser />} <span className="mt-[3px]">{user.role}</span></div>
      </div>
      
      {user.basicDone ?
        <div className="flex justify-around items-center flex-wrap items-center text-xs border-b py-1">
          <p>Name: {user.displayName}</p>
          <p>@{user.username}</p>  
          <p>{user.gender === "male" ? <FaMale/> : <FaFemale/>}</p>        
        </div>
      :
        <p className="text-xs text-center border-b py-1">No Basic Infos</p>
      }
      <p className="text-center my-1">Overview</p>
      <div className="grid grid-cols-2 grid-flow-row overflow-hidden text-xs bg-gray-200 p-1 border-none rounded-md">
        <div className="border-r border-white">
          <p>Amount Spent: ${totalSpent}</p>
          <p>Vat Paid: ${totalVat}</p>
        </div>
        <div className=" ml-1">
          <p>Orders: {orders.length}</p>
          <p>On The Way: {ontheway}</p>
        </div>
      </div>

      <div className="w-full flex justify-center my-1">
        
        <button className="border-none bg-green-600 rounded-sm px-1 mt-1 text-white"
        onClick={e => seeOrders(e, uid)}
        >
        {ordersDetails.includes(uid) ? "Close Order Details" : "Show Order Details"}
        </button>            
        
      </div>

      <div className={`${ordersDetails.includes(uid) ? "" : "hidden"}`}>
        {orders.length !== 0 ? 
          <div>
            {orders.map((take, index) => {
              return (
                <div key={take.id} className="bg-gray-200 border-none rounded-md my-3">
                  <p className="text-center my-1 border-b border-white mx-10 p-1">Order: {index+1}</p>
                  <div className="grid grid-cols-2 grid-flow-row overflow-hidden text-xs p-1 border-b border-white mb-1 mx-1">
                    <div className="border-r border-white">
                      <p>Total: ${take.totalCost}</p>
                      <p>Shipping: ${take.shippingCost}</p>
                      <p>Vat: ${take.vatCost} ({take.vat}%)</p>
                    </div>
                    <div className=" ml-1">
                      <p>Ordered: {take.orderDatePlain} {take.orderTimePlain}</p>
                      <p>Delivery: {take.deliveryDatePlain} {take.deliveryTimePlain}</p>
                      <p>Status: {take.delivered ? "Delivered" : "On the way"}</p>
                    </div>
                  </div>
                  <p className="mx-1 pb-1 border-b border-white ">Delivery Address: {take.addressMini}</p>
                  
                  <p className="text-center pt-1">{take.products.length > 1 ? "Products:" : "Product:"}</p>
                  <div className="flex gap-1 flex-wrap p-1">
                    {take.products && take.products.map(item => (                
                      <p key={item.id} title={`Product Id: ${item.id}`} className="border-none bg-white px-1 rounded-sm hover:cursor-pointer"
                      onClick={e => directLink(e, item.id)}
                      >
                        {item.name} ({item.quantity}) $<span>
                          {item.discount ? (((discountPrice(item.price, item.discount))*item.quantity).toFixed(2)) : ((item.price)*item.quantity)}
                        </span>
                      </p>                
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        :
          <p className="px-1 bg-gray-200 rounded-sm text-center">User didn't make any orders yet!</p> 
        }
      </div>
      
    </section>
  )
}

export default OrderView;