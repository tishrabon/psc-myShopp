import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, increment, deleteField, Timestamp } from "firebase/firestore";
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

// getUSERDATA
const userDataInitialState = {
  isLoading: false,
  error: null,
  orderings: {
    products: [],
  },
  // makeOrder: [],
  orderState: false,
  deliveryDays: 7,
  searchIds:[], 
  
  currentUserData: {
    likes: [],
    carts: [],
    orderings: [],
  }
};

//THUNK ACTION to FETCHING DATA...
export const fetchUserData = createAsyncThunk("namez", async (currentUid, {rejectWithValue})=> {
  try {
    const docRef = doc(db, "userData", currentUid);
    const docSnap = getDoc(docRef);
    return (await docSnap).data();
  } catch (error) {
    console.error("Mission-fetchData Failed")
    return rejectWithValue(error.message);    
  }
})

  export const userDataSlice = createSlice({
  name: "userData",
  initialState: userDataInitialState,

  reducers: {
    InitUSERDATA : (state, action) => {
      state.currentUserData = null,
      state.isLoading = null,
      state.error = null
    },

    updateBASICINFO : (state, action) => {
      try {
        const { pass } = action.payload;
        if (pass === "basic") {
          const { uid, basicLabel, displayName, username, gender, dob } = action.payload;
          const docRef = doc(db, "userData", uid);
          updateDoc(docRef, {
            displayName: displayName,
            username: username,
            dob: dob,
            gender: gender,
            basicDone: true
          });
        } 
        else if (pass === "nameOnly") {
          const { displayName, uid } = action.payload;
          const docReff = doc(db, "userData", uid);
          updateDoc(docReff, {
            displayName: displayName,            
          });
        }       
      }
      catch (err) {
        console.error(err);
      }     
    }, 

    // EXECUTING LIKES
    setLIKES : (state, action) => {
      const { pass, id, uid } = action.payload;
      try {
        const docRef = doc(db, "userData", uid);
        if (pass) {
          updateDoc(docRef, {
            likes: arrayUnion(id)
          });
          state.currentUserData.likes.push(id);
        } else {
          updateDoc(docRef, {
            likes: arrayRemove(id)
          });
          const toLike = state.currentUserData.likes;
          toLike.splice(toLike.indexOf(id), 1);
        }        
      } catch (err) {
        console.error(err);
      }
    },

    setCARTS : (state, action) => {  
      const { pass, id, uid } = action.payload;      
      try {
        const docRef = doc(db, "userData", uid);
        if (pass) {
          updateDoc(docRef, {
            carts: arrayUnion(id)
          });
          let tempCarts = [...state.currentUserData.carts];
          tempCarts.push(id);
          state.currentUserData.carts = [...tempCarts];
        } 
        else {
          updateDoc(docRef, {
            carts: arrayRemove(id)
          });
          const toCart = [...state.currentUserData.carts];
          toCart.splice(toCart.indexOf(id), 1);
          state.currentUserData.carts = [...toCart];
        }
      } catch (err) {
        console.error(err);
      }      
    },

    unCART : (state, action) => {
      try {
        const { id } = action.payload;
        updateDoc(doc(db, "userData", state.currentUserData.uid), {
          carts: arrayRemove(id)
        });

        const carts = state.currentUserData.carts;
        carts.splice(carts.indexOf(id), 1);
      } catch (err) {
        console.error(err);
      }
    },

    // ADDRESS UPDATES
    storeADDRESS: (state, action) => {
      try {
        const { address } = action.payload;
        const docRef = doc(db, "userData", state.currentUserData.uid);
        updateDoc(docRef, {
          addresses: arrayUnion(address)
        }); 

        state.currentUserData.addresses.push(address);
      } catch (err) {
        console.error(err);
      }    
    },

    deleteADDRESS: (state, action) => {
      const { index } = action.payload;
      state.currentUserData.addresses.splice(index, 1);

      const docRef = doc(db, "userData", state.currentUserData.uid);
      updateDoc(docRef, {
        addresses: state.currentUserData.addresses
      })

    },

    storePROCEEDPRODUCTS : (state, action) => {
      try {
        if (!state.orderState) {
          const { product } = action.payload;        
          state.orderings.products.push(product);      
        }

      } catch (err) {
        console.error(err);
      } 
    },  

    removeORDER : (state, action) => {
      try {
        if (!state.orderState) {
          const { id } = action.payload;
          if (state.orderings.products.length > 1) {
            const tempList = state.orderings.products.filter(item => item.id !== id);
            state.orderings.products = [...tempList];
          } else {
            state.orderings.products = [];
          }
        }

      } catch (err) {
        console.error(err);
      }
    },

    clearORDERINGS : (state, action) => {
      try {
        state.orderState = false;
        state.orderings = {
          products: []
        };
      } catch (err) {
        console.error(err);
      }
    }, 
    
    // OPTIONAL ADDITION, LATER REMOVAL MAYBE
    buynowORDER : (state, action) => {
      const { item } = action.payload;
      try {
        if (item) {
          state.orderState = false;
          state.orderings.products = [item];
        }
      } catch (err) {
        console.error(err);
      }
    },


    increasePRODUCT : (state, action) => {
      try {
        if (!state.orderState) {
          const { id } = action.payload;
          state.orderings.products.map(take => {
            if (take.id === id) {
              take.quantity++;          
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    decreasePRODUCT : (state, action) => {
      try {
        if (!state.orderState) {
          const { id } = action.payload;
          state.orderings.products.map(take => {
            if (take.id === id) {
              if (take.quantity > 1) {
                take.quantity--;
              }
            }
          })
        }
      } catch (err) {
        console.error(err);
      }

    },

    initORDER : (state, action) => {
      try {
        state.orderState = true;
      } catch (err) {
        console.error(err);
      }
    },

    confirmORDER : (state, action) => {      
      try {
        const { demo } = action.payload;
        state.orderings = demo;
        const docRef = doc(db, "userData", state.currentUserData.uid);
        updateDoc(docRef, {
          orderHistory: arrayUnion(state.orderings),
          pendingOrders: arrayUnion(state.orderings.id)
        });      

        state.currentUserData.orderHistory.push(state.orderings);
        state.currentUserData.pendingOrders.push(demo.id);

        state.orderings = {
          products: [],
        };
        state.orderState = false;
        
      } catch(err) {
        console.error(err);
      }
    }, 

    deleteORDERS : (state, action) => {
      try {
        const { tobeDeleted } = action.payload;
        const docRef = doc(db, "userData", state.currentUserData.uid);
  
        updateDoc(docRef, {
          orderHistory: arrayRemove(tobeDeleted),
          pendingOrders: arrayRemove(tobeDeleted.id)
        });

        const ohTemp = state.currentUserData.orderHistory.filter(take => take.id !== tobeDeleted.id);
        state.currentUserData.orderHistory = ohTemp;
        const poTemp = state.currentUserData.pendingOrders.filter(take => take !== tobeDeleted.id);
        state.currentUserData.pendingOrders = poTemp;

      } catch (err) {
        console.error(err);
      }
    },

    exeSEARCH : (state, action) => {
      const ids = action.payload || [];
      if (ids.length !== 0) {

        let tempIds = [...state.searchIds];

        ids.forEach(take => {
          if(!state.searchIds.includes(take)) {
            tempIds.push(take);
          }
        })
        state.searchIds = tempIds;
      } 
      else {
        state.searchIds = [];
      }    
    },

    minmaxRANGE : (state, action) => {
      const rangeIds = action.payload;
      if (rangeIds.length !== 0) {
        state.searchIds = [...rangeIds];
      } 
     1
      
    },

    searchTAGS : (state, action) => {
      const tagIds = action.payload;
      const tempIds = [...new Set([...tagIds, state.searchIds])];
      state.searchIds = [...tempIds];
    }, 

    seeLIKEDCARTS : (state, action) => {
      const ids = action.payload;
      state.searchIds = [...ids];
    },

    verificationALERT : (state, action) => {
      state.verificationAlert = true;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      }) 
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUserData = action.payload;

        //  ORDER PENDING TRIALS
        //  INSTEAD OF CHECKING ONLY MAPS MATCHED WITH IDs (TO BE MORE PRECISE IN EXECUTIONS), I AM MAPPING THROUGH ALL ORDERS (SO THAT NO ORDERS ARE MISSED DUE TO INTERNET ISSUE/UPDATE ISSUES)
        if (state.currentUserData.pendingOrders.length !== 0) { 
          if (state.currentUserData.orderHistory.length === 0) {
            state.currentUserData.pendingOrders = [];
            const docRef = doc(db, "userData", state.currentUserData.uid);
            updateDoc(docRef, {
              pendingOrders: []
            })
          } else {
            state.currentUserData.orderHistory.forEach(take => {
              if(!take.delivered){
                const docRef = doc(db, "userData", state.currentUserData.uid);
                const now = new Date();
                const orderDate = new Date(take.orderDate);
                const gap = now - orderDate;
  
                if (gap >= 7*60*1000) {
                  // 1. update state
                  take.delivered = true;
                  take.onTheWay = true;                
                  const pendingIds = state.currentUserData.pendingOrders;
                  pendingIds.splice(pendingIds.indexOf(take.id), 1);
                  // 2. updating databse yall!   
                  updateDoc(docRef, {
                    orderHistory: state.currentUserData.orderHistory,
                    pendingOrders: arrayRemove(take.id)
                  });        
  
                } else {
                  if (!take.onTheWay && gap >= 2*60*1000) {
                    // updating state
                    take.onTheWay = true;
                    //updating database
                    updateDoc(docRef, {
                      orderHistory: state.currentUserData.orderHistory
                    })
                  }
                }
              }
            })
          }
        } 
        // EMAIL VERIFICATION STATE CHECKING
        if (state.currentUserData.verificationAlert) {
          const user = auth.currentUser;
          if (user.emailVerified) {
            updateDoc(doc(db, "userData", state.currentUserData.uid), {
              emailVerified: true,
              verificationAlert: false,
            });
            state.currentUserData.emailVerified = true; 
            state.currentUserData.verificationAlert = false;   
            // window.location.href = "/";
            alert("Congrats! Your email has been verified. Please reload the page if it still shows unverified...");
          }
          
        }
        
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.error = false;
        state.isLoading = false;
      })
  }
});

export const { InitUSERDATA, updateBASICINFO, storeCARTPRODUCTS, storePROCEEDPRODUCTS, increasePRODUCT, decreasePRODUCT, setLIKES, setCARTS, unCART, removeORDER, storeADDRESS, deleteADDRESS, clearORDERINGS, initORDER, confirmORDER, deleteORDERS, exeSEARCH, minmaxRANGE, searchTAGS, seeLIKEDCARTS, buynowORDER } = userDataSlice.actions;

export const userDataSelector = {
  // rdxOne: (state) => state.userData.one,
  rdxFullData: (state) => state.userData.currentUserData
}

