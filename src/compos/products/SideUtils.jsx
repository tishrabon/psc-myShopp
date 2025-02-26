import React, { useState, useEffect } from 'react';
import { products } from '../../data/productData';
import { useDispatch, useSelector } from 'react-redux';
import { exeSEARCH, minmaxRANGE, searchTAGS, seeLIKEDCARTS } from '../../redux/slice/userDataSlice';
import { CiSearch } from 'react-icons/ci';

// DONE SATISFIED COPY 10 104 (inStock & outOfStock added)
const SideUtils = () => {
  const dispatch = useDispatch();
  const stateSearchIds = useSelector(state => state.userData.searchIds);
  const likedIds = useSelector(state => state.userData.currentUserData.likes) || [];
  const cartIds = useSelector(state => state.userData.currentUserData.carts) || [];

  const [search, setSearch] = useState("");
  const [minrange, setMinrange] = useState("");
  const [maxrange, setMaxrange] = useState("");

  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState([]);


  const [searchPass, setSearchPass] = useState(false);
  const [rangePass, setRangePass] = useState(false);
  const [tagPass, setTagPass] = useState(false);
  const [likePass, setLikePass] = useState(false);
  const [cartPass, setCartPass] = useState(false);
  const [inStockPass, setInStockPass] = useState(false);
  const [soldOutPass, setSoldOutPass] = useState(false);

  const [rangeNegative, setRangeNegative] = useState("");
  const [showMoreTags, setShowMoreTags] = useState(false);

  const clearRangeGarbage = () => {
    setRangePass(false);
    setMinrange("");
    setMaxrange("");
    setRangeNegative("");
  }

  // CLEAR SEARCH //
  const clearSearch = (e) => {
    e.preventDefault();
    setMinrange("");
    setMaxrange("");
    setSearch("");
    setRangeNegative("");
    setTags([]);
    setSearchPass(false);
    setRangePass(false);
    setTagPass(false);
    setLikePass(false);
    setCartPass(false);
    setInStockPass(false);
    setSoldOutPass(false);
    setShowMoreTags(false);

    dispatch(exeSEARCH());
  }

  const clearWay = (e) => {
    e.preventDefault();
    setMinrange("");
    setMaxrange("");
    setSearch("");
    setTags([]);
    setSearchPass(false);
    setRangePass(false);
    setTagPass(false);
  }

  // GENERAL SEARCH //
  const exeSearch = (e, data) => {
    e.preventDefault();
    if (data !== "" && data.length > 1) {
      // FILLED
      let tempIds = []; 
      products.forEach(take => {       
        if (take.name.toLowerCase().includes(data.toLowerCase())) {
          if (!tempIds.includes(take.id)) {
            tempIds.push(take.id);
          }
        }            
        else {
          take.tags.forEach(item => {
            if (item.toLowerCase().includes(data.toLowerCase())) {                  
              if (!tempIds.includes(take.id)) {
                tempIds.push(take.id);
              }
            }
          })
        }                 
      })
      dispatch(exeSEARCH(tempIds));
      setSearchPass(true);
      setSearch(data);
      clearRangeGarbage();
    }
  }

  // SEARCH BY TAGS //
  const searchByTags = (e, data) => {
    e.preventDefault();
    let tempTagIds = [];
    let newTags = new Set(tags);
    products.forEach(take => {
      for(const item of take.tags) {
        if (item.toLowerCase().includes(data.toLowerCase())) {
          if (!tempTagIds.includes(take.id)) {
            tempTagIds.push(take.id);
            if (!tags.includes(item)) {
              newTags.add(item);
            }
          }
          break;
        }
      }
    })
    dispatch(exeSEARCH(tempTagIds));
    setTags([...newTags]);
    setTagPass(true);
    clearRangeGarbage();
  }

  // SEE INSTOCKS //
  const seeInStocks = (e) => {
    e.preventDefault();
    
    if (!inStockPass) {
      clearWay(e);

      setInStockPass(true);      
      let tempInStockIds = [];
      products.forEach(take => {
        if (take.inStock === true) {
          if (!tempInStockIds.includes(take.id)) {
            tempInStockIds.push(take.id);
          }
        }
      });
      if (tempInStockIds !== 0) {
        dispatch(exeSEARCH(tempInStockIds));
        clearRangeGarbage();
      }
    }
    // else {
    //   setInStockPass(false);
    // }
  }

  // SEE SOLDOUTS //
  const seeSoldOuts = (e) => {
    e.preventDefault();

    if (!soldOutPass) {
      clearWay(e);

      setSoldOutPass(true);
      let tempSoldOutIds =  [];
      products.forEach(take => {
        if (take.inStock === false) {
          if (!tempSoldOutIds.includes(take.id)) {
            tempSoldOutIds.push(take.id);
          }
        }
      });
      if (tempSoldOutIds !== 0) {
        dispatch(exeSEARCH(tempSoldOutIds));
        clearRangeGarbage();
      }
    }
    // else {
    //   setSoldOutPass(false);
    // }
  }

  // SEARCH BY RANGE //
  const setPriceRange = (e, min, max) => {
    e.preventDefault();

    try {
      if (min >= 0 && max > 0 && max > min) {
        if (stateSearchIds.length !== 0) {
          let tempRangeIds = [];
          products.forEach(take => {
            if (stateSearchIds.includes(take.id)) {
              if (take.price > min && take.price < max) {
                tempRangeIds.push(take.id);
              }
            }
          })
          dispatch(minmaxRANGE(tempRangeIds));
          setRangePass(true);
  
          if (tempRangeIds.length === 0) {
            setRangeNegative("Price Range Not Matched!");
          } 
        } 
        else {
          let tempRangeIds = [];
          products.forEach(take => {
            if (take.price > min && take.price < max) {
              if (!tempRangeIds.includes(take.id)) {
                tempRangeIds.push(take.id);
              }
            }
          })
  
          dispatch(minmaxRANGE(tempRangeIds));
  
          if (tempRangeIds.length === 0) {        
            // setRangePass(false);
            setRangeNegative("Price Range Not Matched!");
          }
        }
        setRangePass(true);      
      }
    } catch (err) {
      console.error(err);
    }
  } 

  // SEE LIKED 
  const seeLiked = (e) => {
    e.preventDefault();
    clearWay(e);

    if (!likePass) {
      if (likedIds.length !== 0) {
        setLikePass(true);
        setCartPass(false);
        setInStockPass(false);
        setSoldOutPass(false);
        let tempLikedIds = [];
        products.forEach(take => {
          if (likedIds.includes(take.id)) {
            if (!tempLikedIds.includes(take.id)) {
              tempLikedIds.push(take.id);
            }
          }
        });
  
        if (tempLikedIds.length !== 0) {
          dispatch(seeLIKEDCARTS(tempLikedIds));
        }
      }
    }
    else {
      clearSearch(e);
    }
  }

  // SEE CART
  const seeCart = (e) => {
    e.preventDefault();
    clearWay(e);

    if (!cartPass) {
      if (cartIds.length !== 0) {
        setCartPass(true);
        setLikePass(false);
        setInStockPass(false);
        setSoldOutPass(false);
        let tempCartIds = [];
        products.forEach(take => {
          if (cartIds.includes(take.id)) {
            if (!tempCartIds.includes(take.id)) {
              tempCartIds.push(take.id);
            }
          }
        });
  
        if (tempCartIds.length !== 0) {
          dispatch(seeLIKEDCARTS(tempCartIds));
        }
      }
    }
    else {
      clearSearch(e);
    }
  }

  useEffect(() => {
    //  TAGS SEARCH IN SIDEUTILS
    let tagsTemp = [];
    products.forEach(take => {             
      take.tags.forEach(item => {
        if (!tagsTemp.includes(item.toLowerCase())) {
          tagsTemp.push(item.toLowerCase());
        }
      })  
    })
    setTagList(tagsTemp);

  }, [products])


  return (
    <section className="w-full rounded-md sm:max-w-[300px] mb-2 sm:sticky top-[70px]">
      
      {/* LIKED & ADDED TO CART FILTER */}
      <div className="flex justify-between items-center w-full py-2 px-2 rounded-[10px] bg-gray-200">

        {/* LIKED DIVISION */}
        <div className="text-sm text-gray-800 w-full flex flex-col justify-start items-center">
          <p>
            Liked ({likedIds.length && likedIds.length !== 0 ? likedIds.length : "0"})
          </p>
          <div>
            <button className={`w-[100px] border-none rounded-md px-2 py-1 my-1 ${likePass ? "bg-red-600 text-white" : "bg-green-600 text-white"}`} onClick={seeLiked}>{likePass ? "clear" : "see products"}</button>
          </div>
        </div>
        
        {/* CART DIVISION */}
        <div className="text-sm text-gray-800 w-full flex flex-col justify-start items-center">
          <p>
            Cart ({cartIds.length && cartIds.length !== 0 ? cartIds.length : "0"})
          </p>
          <div>
            <button className={`w-[100px] border-none rounded-md px-2 py-1 my-1  ${cartPass ? "bg-red-600 text-white" : "bg-green-600 text-white"}`} onClick={seeCart}>{cartPass ? "clear" : "see products"}</button>
          </div>
        </div>

      </div>

      {/* SEARCH AND FILTER  */}
      <div className="w-full my-2 p-1 rounded-[10px] bg-gray-200">

        {/* SEARCH RESULTS DISPLAY */}
        <div className="w-full flex flex-col justify-between items-center text-sm text-gray-700">       

          <p className={`${stateSearchIds.length === 0 ? "hidden" : ""}`}>Total Result: {stateSearchIds.length}</p>

          <div className={`${!searchPass ? "hidden" : ""} `}>Showing Result for <span className="text-blue-600">{search}</span></div>

          <div className={`${!rangePass ? "hidden" : ""} flex flex-col justify-between items-center`}>
            <span>Range: ${minrange} - ${maxrange}</span>
            <div className={`${!rangeNegative.length !== 0 ? "" : "hidden"}`}>{rangeNegative}</div>
          </div>
        
          <div className={`${!tagPass ? "hidden" : ""} `}>
            {/* <p>Tags:</p> */}
            <div className="flex flex-wrap">
              {tags.map(item => {
                return (
                  <span key={Math.random()} className="text-sm text-white px-1 py-[1px] m-1 border-none rounded-sm bg-gray-400 text-center ">{item}</span>
                )
              }              
              )}
            </div>
          </div>

        </div>

        {/* SEARCH DIVISION       */}
        <div className="m-1 p-1 rounded-md"> 

          {/* INPUTS */}
          <div className="flex flex-col flex flex-col items-center">
            <input className="w-full h-[35px] border-none rounded-md bg-white mx-1 my-2 px-1" type="text" id="search" name="search" placeholder="min 2 characters" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                exeSearch(e, search);
              }
            }}
            /> 

            {/* // SEARCH BUTTONS // */}
            <div className="w-full flex justify-between items-center text-sm">
              {/* CLEAR BUTTON */}
              <button className="px-2 text-center bg-red-600 border-none rounded-md text-white" title="Click it to refreash search engine..."
              onClick={e => clearSearch(e)}
              >refresh search</button>

              {/* SEARCH BUTTONS */}
              <button className="text-gray-600 px-2 text-center bg-white border-none rounded-md flex flex-row items-center gap-x-1" onClick={e => exeSearch(e, search)}>< CiSearch />search</button>        
            </div>         
          </div>  

          {/* MIN MAX EXP */}
          <div className="text-sm mx-1 my-1 p-1 flex justify-center w-full items center">    
            {/* minrange */}
            <input className="w-[60px] border-none rounded-md bg-white mx-1 px-1 text-center" type="number" id="minrange" name="minrange" value={minrange}
            onChange={e => setMinrange(e.target.value)} placeholder="min"
            />

            <p className="mx-1 text-gray-400 text-sm flex justify-center items-center">to</p>
            {/* maxrange */}        
            <input className="w-[60px] border-none rounded-md bg-white mx-1 px-1 text-center" type="number" id="maxrange" name="maxrange" value={maxrange}
            onChange={e => setMaxrange(e.target.value)} placeholder="max"
            />        

            <button className="text-gray-600 px-2 text-sm text-center bg-white border-none rounded-md ml-1" onClick={e => setPriceRange(e, minrange, maxrange)}>set range</button>        
          </div>

        </div>

        {/* SEARCH BY TAGS */}
        <div className="m-1 border border-white p-1 rounded-md max-h-[260px] overflow-y-auto">  

          {/* SEE INSTOCKS / OUTOFSTOCKS */}
          <button className={`text-xs px-1 m-1 border-none rounded-sm ${inStockPass ? "bg-green-600 text-white" : "bg-white text-green-700"}`} onClick={seeInStocks}>inStocks</button>

          <button className={`text-xs px-1 m-1 border-none rounded-sm ${soldOutPass ? "bg-red-600 text-white" : "bg-white text-red-700"}`} onClick={seeSoldOuts}>soldOuts</button>

          {tagList.map((take, index) => {
            if (!showMoreTags && index > 7) {
              return null
            } else {
              return (
                <button key={take} className="text-xs text-gray-600 m-1 px-1 border-none rounded-sm bg-white" onClick={e => searchByTags(e, take)}>
                  {take} 
                </button>
              )
            }
          })} 
          <button className="text-blue-600 text-center text-sm mt-1 px-2" onClick={() => setShowMoreTags(prev => !prev)}>
            {showMoreTags ? "...show less tags" : "show all tags..."}
          </button> 
        </div> 

      </div>
    
    </section>
  )
}

export default SideUtils;