import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { products } from '../../data/productData';
import { storeCARTPRODUCTS } from '../../redux/slice/userDataSlice';
import { ShowCartList } from './ShowCartList';
import { ProceedOrder } from './ProceedOrder';
import { MakeOrder } from './MakeOrder';
import { Link } from 'react-router-dom';

const Cart = () => {

  const cartStyles = {
    container: `grid sm:grid-cols-2 sm:justify-between sm:items-start place-items-center gap-x-2 w-[98%] gap-y-1`,

    billboard: `w-full bg-green-600 text-white p-2 rounded-md font-bold mb-2`, 
    cartList: `box-shadow rounded-md mb-4 pb-3 flex flex-col justify-center items-center flex-1 w-[95%]`, 
    orderList: `box-shadow p-1 rounded-md`, 
    lines: `p-1`, 
    box: `bg-gray-100 m-1 p-1 rounded-md`, 
    // B O R D E R //

    proceed: `box-shadow rounded-md mb-4 pb-3 flex flex-col justify-center items-center flex-1 w-[95%]`,
  };
  
  const dispatch = useDispatch();

  const orderings = useSelector(state => state.userData.orderings);
  const cartList = useSelector(state => state.userData.currentUserData.carts);
  const addresses = useSelector(state => state.userData.currentUserData.addresses);  
  const [cartProducts, setCartProducts] = useState([]);
  // const [oProducts, setOProducts] = useState([]);
  let tempList = [];


  useEffect(() => {
    tempList = []
    if (cartList) {
      cartList.map(id => {
       const take = products.find(take => take.id === id)
        if(take && !tempList.includes(take.id)) {
          tempList.push(take);
        }
        setCartProducts(tempList);              
      })
    }
  }, [cartList]);

  return (
    <section className={cartStyles.container}>

      <div className={cartStyles.cartList}>
        <p className={cartStyles.billboard}>Cart List</p>

        { cartProducts.slice().reverse().map((product) => {          
          return (
            <ShowCartList key={product.id} product={product} />
          )
        }) }  

        <div className={`${addresses && cartList.length !== 0 && addresses.length === 0 ? "" : "hidden"} text-center text-sm m-2 text-red-600`}>
          You have not added any address yet, Please add minimum 1 address before you proceed any order! Go to <Link className="text-green-600" to="/UpdateUser">Update User</Link> to add address.
          
        </div>

      </div>

      {/* <div className="bg-blue-200">hello</div> */}

      <div className={cartStyles.proceed}>
        <p className={`${cartStyles.billboard} bg-yellow-600`}>Confirm Order</p> 

        {orderings.products.map((product) => {
          return (
            <ProceedOrder key={product.id} product={product}/>
          )
        })}

        <MakeOrder />
       
      </div>      

    </section>
  )
}

export default Cart;