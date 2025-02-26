import React, { useState, useEffect } from 'react';
import { products } from '../../data/productData';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { FaCartArrowDown } from 'react-icons/fa';
import { buynowORDER } from '../../redux/slice/userDataSlice';

// the issue with copy 6 solved
import { setLIKES } from '../../redux/slice/userDataSlice';
import { setCARTS } from '../../redux/slice/userDataSlice';
import { useSelector } from 'react-redux';

const ProductPage = () => {
  const { productId } = useParams();
  const [item, setItem] = useState(null);
  const [relateds, setRelateds] = useState([]);
  const [pass, setPass] = useState(false);
  const [addressAlert, setAddressAlert] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const uid = useSelector(state => state.userData.currentUserData.uid) || null;
  const likes = useSelector(state => state.userData.currentUserData.likes) || [];
  const carts = useSelector(state => state.userData.currentUserData.carts) || [];
  const addresses = useSelector(state => state.userData.currentUserData.addresses) || [];

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  }

  const directLink = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  }

  const findRelateds = (tags, notId) => {
    let tempRelated = [];
    products.forEach(take => {
      take.tags.forEach(tag => {
        if (tags.includes(tag) && !tempRelated.includes(take) && take.id !== notId) {
          tempRelated.push(take);
        }
      })
    })
    if (tempRelated.length !== 0) {
      setRelateds(tempRelated);
      setPass(true);
    }
  }

  //EXECUTING LIKES/UNLIKES
  const exeLikes = (e, id) => {
    e.preventDefault();

    if (uid) {
      if (likes.includes(id)) {
        dispatch(
          setLIKES({
            pass: false,
            id: id,
            uid: uid  
          })
        );
  
      } else {
        dispatch(
          setLIKES({
            pass: true,
            id: id,
            uid: uid
          })
        )
      }
    } else {
    }
  }

  //EXECUTING CARTS/UNCARTS
  const exeCarts = (e, id) => {
    e.preventDefault();

    if (uid) {
      if (carts.includes(id)) {
        // UNCART
        dispatch(
          setCARTS({
            pass: false,
            id: id,
            uid: uid
          })
        )
      } else {
        dispatch(
          setCARTS({
            pass: true,
            id: id,
            uid: uid
          })
        )
      }
    }
  }

  const buynowItem = (e, item) => {
    e.preventDefault();
    if (uid && item.inStock) {
      if (addresses.length !== 0) {
        dispatch(
          buynowORDER({item})
        );
        navigate("/cart")

      } else {
        setAddressAlert(true);
      }
    }
  }

  useEffect(() => {
    const product = products.find(take => take.id === parseInt(productId));
    if (product) {
      setItem(product);
      findRelateds(product.tags, product.id);
    }
  }, [productId]);


  return (
    <div className="w-full text-gray-600">      
      { item ?
        <div className={`grid grid-rows-2 sm:grid-cols-[1fr_25%] gap-1`}>
          
          {/* ITEM'S DIVISION */}
          <div className="w-full flex flex-col items-center justify-start">            
            {/* IMG DIVISION */}
            <div className="w-full sm:w-[50%] aspect-square border-none rounded-xl overflow-hidden bg-blue-100">
              {/* img division / id */}
              <img className="w-full h-full object-cover object-center" src={item.image} alt={item.name} />
            </div>

            {/* NAME & BIO DIVISION */}
            <p className="mx-2 mt-5 text-gray-800 text-center w-full w-full sm:w-[50%] text-2xl">{item.name}</p>
            <p className="mx-2 pb-2 border-b text-gray-800 text-center w-full w-full sm:w-[50%] text-lg" >{item.bio}</p>            

            {/* PRODUCT DATA SECTION */}
            <div className="w-full sm:w-[70%] px-2">

              {/* RATING, CATAGORY, ID, inSTOCK, BUY NOW */}
              <div className={`${addressAlert ? "" : "border-b"} w-full py-3 flex flex-row justify-between items-center`}>

                <div className="flex flex-col justify-between items-start">
                  <div className="flex justify-center items-center gap-1">Rating: {item.rating}/5 </div>
                  <p>Catagary: {item.catagory}</p>
                  <p>Product Id: {item.id}</p>
                  <p className={`${item.inStock ? "hidden" : ""} text-sm text-red-600 border border-red-600 rounded-sm px-1`}>Not Available!</p>
                </div>

                <div className="flex flex-col justify-between items-start gap-2">
                  { item.inStock ? 
                    <p className="px-2 py-1 border border-green-600 rounded-md text-green-600 w-[100px] text-center font-medium">inStock!</p>
                  :
                    <p className="px-2 py-1 border border-red-600 rounded-md text-red-600 w-[100px] text-center font-medium">soldOut!</p>
                  }

                  <button className={`${!item.inStock ? "line-through" : "" } px-2 py-1 border-none bg-yellow-500 rounded-md text-white w-[100px] text-center cursor-grabbing`}
                  onClick={e => buynowItem(e, item)}
                  >Buy Now!</button>

                </div>

              </div>
              <div className={`${addressAlert ? "" : "hidden"} border border-red-600 p-2 rounded-md text-red-600 text-sm`}>
                <p>
                  Dear user, you have not added any addresses yet! It's our policy to add minimum 1 address before proceeding any kind of order! So please add address before you proceed any order! Go to <Link to="/updateuser" className="text-blue-600 border p-1 rounded-md text-sm">Update User</Link>
                </p>
                <div className="w-full text-right">
                  <button className="my-1 border-none bg-green-600 text-white p-1 rounded-sm px-2"
                  onClick={() => setAddressAlert(false)}
                  >Okay, Got It</button>
                </div>
              </div>

              {/* PRICE CART LIKES */}
              <div className="w-full flex flex-row justify-between items-start py-3 border-b">
                {/* price, discount */}
                <div>
                  {!item.discount ? 
                    <div>
                      <div className="text-2xl">$ {(item.price).toFixed(2)}</div>
                      <p>Discount: Not Available!</p>
                    </div>
                  :
                    <div>
                      <span className="text-xl">$ {(discountPrice(item.price, item.discount)).toFixed(2)} </span> 
                      <span className="line-through text-red-800">{(item.price).toFixed(2)}</span>
                      <p>Discount: {item.discount}%</p>
                      <p className="font-medium text-blue-800 text-lg">Save: ${((item.price) - (discountPrice(item.price, item.discount))).toFixed(2)}!</p>

                    </div>
                  }
                </div>
                {/* like, cart  */}
                <div>
                  {likes.includes(item.id) ? 
                    <button className="px-5 py-2 border-none bg-gray-600 text-white rounded-md mb-2 w-[100px] flex justify-center"
                    onClick={(e) => {exeLikes(e, item.id)}}                    
                    ><AiFillLike/></button>
                  :
                    <button className="px-5 py-2 border text-gray-600 rounded-md mb-2 w-[100px] flex justify-center"
                    onClick={(e) => {exeLikes(e, item.id)}}
                    ><AiOutlineLike/></button>
                  }
                  
                  {carts.includes(item.id) ? 
                    <button className="px-5 py-2 border-none bg-gray-600 text-white rounded-md w-[100px] flex justify-center"
                    onClick={(e) => {exeCarts(e, item.id)}}
                    ><BsFillCartCheckFill/></button>
                  :
                    <button className="px-5 py-2 border text-gray-600 rounded-md w-[100px] flex justify-center"
                    onClick={(e) => {exeCarts(e, item.id)}}                    
                    ><FaCartArrowDown/></button>

                  }
                  
                </div>
              </div>

              {/* PRODUCTS INFOS */}
              <div className="w-full py-3 border-b">
                <p className="w-full text-start my-1">Details:</p>
                <p>{item.infos}</p>
                <p>{item.infos}</p>
                <p>{item.infos}</p>
              </div>

              <div className="w-full py-3 border-b">
                <span className=" pr-2">tags:</span>
                <div className="flex flex-wrap">
                  {item.tags.map(tag => (
                    <span className="px-1 border-none bg-gray-200 rounded-sm my-1 mr-1 text-center" key={Math.random()}>{tag}</span>
                  ))}
                </div>                
              </div>

              <div className="w-full mb-3 py-3 border-b">
                <p>My Appreciation to the Artist of this Image that I Used as Sample Photo</p>
                <p className="p-1 border-none bg-gray-200 rounded-sm overflow-hidden text-sm">{item.imgAttribute}</p>
              </div>
            </div>

          </div>

          {/* SIDE SHOWS */}
          <div className="p-1 hidden sm:flex flex-col border-l pl-3">
            <p className="p-1 border-none bg-green-600 rounded-sm text-white text-center mb-3">Related Products </p>     
              {pass && relateds.length !== 0 ? 
                <div>
                  {relateds.map(take => (
                    <div key={take.id} className="flex justify-start overflow-hidden p-1 sm:text-[14px] md:text-[16px] mb-3 border-b pb-3">
                      <div className="aspect-square w-[30%] h-full overflow-hidden rounded-md mr-1 hover:cursor-pointer"
                      onClick={(e) => directLink(e, take.id)}
                      >
                        <img className="w-full h-full object-cover object-center" src={take.image} alt={take.name} />
                      </div>
                      <div>
                        <p>{take.name}</p>
                        <div>
                          {/* ${take.price} */}
                          { take.discount ? 
                            <div>${(discountPrice(take.price, take.discount)).toFixed(2)} <span className="line-through text-[12px] md:text-[14px] text-red-600">${(take.price)}</span></div>
                          :
                            <div>${(take.price).toFixed(2)}</div>
                          }
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              :
                <div>
                  no relatives! sad! yall!
                </div>
              }
          </div>

          {/* DOWN SHOWS */}
          <div className={`p-1 sm:hidden`}>
            <p className="mb-3 w-full border-none bg-green-600 rounded-sm p-1 text-white text-center">Related Products</p>
            {/* <p>DOWN shows </p>               */}
              {pass && relateds.length !== 0 ? 
                <div className="w-full grid grid-cols-2 xs:grid-cols-3 gap-3">
                  {relateds.map(take => (
                    <div className="box-shadow border-none rounded-md overflow-hidden w-full" key={take.id}>
                      {/* imgage */}
                      <div className="aspect-square w-full h-[100px] ss:h-[120px] overflow-hidden bg-red-100 hover:cursor-pointer"
                      onClick={(e) => directLink(e, take.id)}
                      >
                        <img className="w-full h-full object-cover object-center" src={take.image} alt={take.name} />
                      </div>
                      <div className="p-1 text-sm">
                        <p>{take.name}</p>
                        <div>
                          { take.discount ? 
                            <div>${(discountPrice(take.price, take.discount)).toFixed(2)} <span className="line-through text-[12px] text-red-600">${(take.price)}</span></div>
                          :
                            <div>${(take.price).toFixed(2)}</div>
                          }
                        </div>
                        {/* <p>{take.id}</p> */}
                      </div>
                                        
                    </div>
                  ))}
                </div>
              :
                <div>
                  no relatives! sad! yall!
                </div>
              }           
          </div>

        </div>
      :
        <div className="text-center text-[20px] text-red-600">
          Product Not Found! Sorry...          
        </div>        
      }
    </div>
  )
}

export default ProductPage;
