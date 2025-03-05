import React from 'react';
import demoing from '../../compos/products/demo-1.jpg';
import { products } from '../../data/productData';
import { useDispatch, useSelector } from 'react-redux';
import { storePROCEEDPRODUCTS, unCART } from '../../redux/slice/userDataSlice';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaStar } from "react-icons/fa";

export const ShowCartList = ({product}) => {

  const styles = {
    box: `flex flex-row overflow-hidden w-[98%] h-auto bg-gray-100 m-1 rounded-md`,  
    // photo: `aspect-w-1 aspect-h-1 w-[45px] h-[45px]`,
    photo: `max-h-[50px] aspect-square border-none rounded-md`,
    photoFile: `w-full h-full object-cover object-center`,
    details: `flex flex-row text-[10px] xs:text-[12px] justify-between items-center w-full object-cover px-2`,
    one: `w-[40%] flex flex-col justify-between items-start h-full pb-1`,
    two: `w-[25%] mx-1 flex flex-col justify-between items-start h-full pb-1`,
    three: `w-[35%] overflow-hidden flex flex-col justify-between items-start h-full pb-1`,
    proceedButton: `border-none bg-green-600 text-white px-1 rounded-sm`,
    removeButton: `border-none bg-red-500 text-white px-1 rounded-sm`,
  }

  // const orderingProducts = useSelector(state => state.userData.orderingProducts) || null;
  // const opId = useSelector(state => state.userData.opId); 
  const orderings = useSelector(state => state.userData.orderings);
  const uid = useSelector(state => state.userData.currentUserData.uid);
  const orderState = useSelector(state => state.userData.orderState);
  const addresses = useSelector(state => state.userData.currentUserData.addresses) || []

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const directLink = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  }

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  }

  const proceedOrder = (e, product) => {
    e.preventDefault();
    if (!orderState && addresses.length !== 0) {
      if (uid) {
        if (product.inStock) {
          if (!orderings.products.some(item => item.id === product.id)) {
            dispatch(
              storePROCEEDPRODUCTS({
                product: product
              })
            );
          } else {
          }
        } else {
          console.error("Sorry! Product is currently out of stock!");
        }
      }
    }
  }

  const exeUnCart = (e, id) => {
    e.preventDefault();
    dispatch(
      unCART({
        id: id
      })
    );
  }

  return (
    <section key={product.id} className={styles.box}>      

      <div className={styles.photo}>
        <img className={styles.photoFile} src={product.image} alt="demo images yall!" />
      </div>

      <div className={styles.details}>

        <div className={styles.one}>
          <p className="hover:cursor-pointer hover:text-green-800"
          onClick={(e) => directLink(e, product.id)}
          >{product.name}</p>
          <p>{product.inStock ? 
            <span className="text-green-700 rounded-md px-1 border-[1px] border-green-600">in Stock</span> 
            :
            <span className="text-red-600 rounded-md px-1 border-[1px] border-red-600">sold Out!</span>
          }</p>
        </div>

        <div className={styles.two}>
          <div className="flex place-items-center gap-1"><FaStar /> {product.rating} </div>
          <button onClick={e => exeUnCart(e, product.id)} className={styles.removeButton}>Remove</button>
        </div>

        <div className={styles.three}>
          {/* PRICE */}
          <p>
            {product.discount ? 
              <div>
                <div>
                  ${discountPrice(product.price, product.discount)}
                </div>
                <div className="flex place-items-center gap-1">
                  {` ${product.discount}%`} <FaTag />
                </div>                 
              </div>
            :
              <div>${product.price}</div>
            }
          </p>
          
          { product.inStock ? 
            <button onClick={(e) => proceedOrder(e, product)} className={styles.proceedButton}>Proceed</button>
          : 
            <button className={`border-none bg-green-500 text-white px-1 rounded-sm`}>Proceed</button> 
          }          
        </div>

      </div>
      
    </section>
  )
}
