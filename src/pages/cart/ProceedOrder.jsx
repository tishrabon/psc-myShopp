import React from 'react';
import demoing from '../../compos/products/demo-1.jpg'
// import { products } from '../../data/productData';
import { increasePRODUCT, decreasePRODUCT, removeORDER } from '../../redux/slice/userDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { FaTag } from "react-icons/fa";

export const ProceedOrder = ({product}) => {
  const styles = {
    box: `flex flex-row overflow-hidden w-[95%] h-auto bg-gray-100 m-1 rounded-md`,
    // photo: `aspect-w-1 aspect-h-1 w-[45px] h-[45px]`,
    photo: `w-[50px] aspect-square border-none rounded-md overflow-hidden`,
    photoFile: `object-cover w-full h-full`,
    details: `flex flex-row text-[10px] xs:text-[12px] justify-between items-center w-[100%] object-cover px-2`,
    one: `w-[40%] flex flex-col justify-between items-start h-full pb-1`,
    two: `w-[30%] flex gap-[2px]`,
    three: `w-[30%] overflow-hidden flex flex-col justify-between items-start h-full pb-1`,
    plusMinus: `bg-gray-300 border-none text-black rounded-sm w-5 mx-1`,
    removeButton: `border-none bg-red-500 text-white px-1 rounded-sm text-center`,
  }

  const dispatch = useDispatch();
  const orderState = useSelector(state => state.userData.orderState);

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  } 

  const removeOrder = (e, id) => {
    e.preventDefault();
    dispatch(
      removeORDER({
        id: id
      })
    );
  }

  const increase = (e, id) => {    
    e.preventDefault();
    dispatch(
      increasePRODUCT({
        id: id
      })
    );
  }

  const decrease = (e, id) => {
    e.preventDefault();
    dispatch(
      decreasePRODUCT({
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
          <p>{product.name}</p>
          <p>{"Quantity: "}{product.quantity}</p>
        </div>

        {/* PLUS MINUS +/- */}
        <div className={styles.two}>
          <button onClick={(e) => increase(e, product.id)} className={styles.plusMinus}>+</button>

          <button onClick={(e) => decrease(e, product.id)} className={styles.plusMinus}>-</button>
        </div>

        <div className={styles.three}>
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
              <>${product.price}</>
            }
          </p>
          <button onClick={e => removeOrder(e, product.id)} className={styles.removeButton}>Remove</button>
        </div>

      </div>
      
    </section>
  )
}
