import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { products } from '../../data/productData';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { FaCartArrowDown } from 'react-icons/fa';
import { setLIKES, setCARTS } from '../../redux/slice/userDataSlice';
import { useNavigate } from 'react-router-dom';

const ShowProducts = () => {
  const shop = {
    container: `grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 justify-center items-start w-full gap-3 ss:gap-4`,

    box: `group bg-white rounded-[10px] text-maincolor flex flex-col w-full h-[full] flex justify-center box-shadow hover:bg-gray-100 `,

    up: `aspect-w-1 aspect-h-1 bg-opcolor rounded-[10px] overflow-hidden cursor-pointer`,
    down: `flex-1 centaY p-2 text-gray-800  group-hover:p-1`, 

    instock: `text-[11px] md:text-[12px] border-none px-1 bg-green-700 rounded-md text-white text-center`,
    
    outofstock: `text-[11px] md:text-[12px] border-none px-1 bg-dontcolor rounded-[5px] text-white text-center`,

    likeicon: `h-6 w-6`,
    addCart: `h-6 w-6`,
  }

  // const [cartPass, setCartPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cud = useSelector(state => state.userData.currentUserData);
  const uid = useSelector(state => state.userData.currentUserData.uid) || null;
  const searchIds = useSelector(state => state.userData.searchIds);

  const [likes, setlikes] = useState([]);
  const [carts, setCarts] = useState([]);
  const [searchProducts, setSearchProducts] = useState(null);

  const discountPrice = (price, discount) => {
    return (price - ((price * discount)/100));
  }

  const saveMoney = (price, discount) => {
    return ((price * discount)/100);
  }

  const directLink = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  }

  // EXECUTING LIKE/UNLIKE METHODS!
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
    }
  }

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

  useEffect(()=> {
    // LIKES/CARTS
    if (cud) {
      setlikes(cud.likes);
      setCarts(cud.carts);
    }

    // SEARCH MATTERS
    if (searchIds.length !== 0) {
      let tempIds = [];
      products.forEach(take => {
        if (searchIds.includes(take.id)) {
          tempIds.push(take);
        }
      })
      setSearchProducts(tempIds);
    } else {
      setSearchProducts(null);
    }
  }, [cud, searchIds]); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className={shop.container}>      
     
      { (searchProducts && searchProducts.length !== 0 ? searchProducts : products).map((product, index) =>  {      
        const {id, name, price, inStock, catagory, bio , infos, image, discount} = product        

        return (
          <div key={product.id} className={shop.box}            
          >  

            <div className="relative z-2 aspect-square rounded-[10px] overflow-hidden cursor-pointer w-full h-full"
            onClick={e => directLink(e, product.id)}
            >              
              {/* img/discount/price */}
              <div className={`${discount ? "" : "hidden"}`}>
                <div className={`group-hover:flex hidden absolute w-full justify-center items-center bg-white opacity-50 text-black right-0 py-1`}>
                  <p>SAVE ${(saveMoney(price, discount)).toFixed(2)}</p>
                </div>
              </div>

              <img className="w-full h-full object-cover object-center" src={image} alt=""/>
            </div>

            <div className={shop.down}>
              <span className={`font-medium text-[14px] sm:text-[16px] `}>{name}</span>

              {/* BIO */}
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-[12px] sm:text-[14px]">                 
                  {bio}
                </span>            
                                                           
              </div>

              {/* PRICE */}
              <div className={`centaXbet my-1`}>
                {discount ? 
                  <div className="text-[17px]">
                    <span className="">${(discountPrice(price, discount)).toFixed(2)}</span> <span className="text-[14px] text-red-600 line-through">${price}</span>
                  </div> 
                :
                  <div className="text-[16px]">
                    ${`${(price).toFixed(2)}`}
                  </div> 
                }      

              </div> 
              
              {/* SEE LATER */}  
              <div className="w-full flex justify-between items-center mb-1 text-[10px] md:text-[12px]">
                <span className="text-amber-700">{catagory}</span>

                <span className={`${inStock ? shop.instock : shop.outofstock}`}>{inStock ? "inStock" : "soldOut!"}</span> 
              </div>                             

              {/* LIKE/CART */}
              <div className="centaXbet">
                {/* LIKE BUTTONS */} 
                <button
                  onClick={(e) => {exeLikes(e, product.id)}}                
                >
                  {likes.includes(product.id) ? 
                    <AiFillLike 
                      className={`${shop.likeicon}`} 
                    /> 
                  : 
                  < AiOutlineLike
                    className={`${shop.likeicon}`}
                  />}
                </button>

                {/* CART BUTTONS */} 
                <div className="flex flex-row justify-center items-center my-1">                  
                  <span className="text-[11px] mr-1 mt-1 md:text-[13px]">
                    {carts.includes(product.id) ? "Added" : "Add to"} 
                  </span>
                  
                  <button className="mr-1"
                    onClick={(e) => {exeCarts(e, product.id)}}                    
                  >
                    {carts.includes(product.id) ? 
                      <BsFillCartCheckFill className={shop.addCart} /> 
                    : 
                      <FaCartArrowDown className={shop.addCart} /> }
                  </button>
                </div>                
              </div>

            </div> 

          </div>
             
        )            
      }) }      
    </div>
  )
}

export default ShowProducts;
