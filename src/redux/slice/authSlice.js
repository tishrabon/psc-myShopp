import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, increment, deleteField, Timestamp } from "firebase/firestore";
import { fetchUserData } from "./userDataSlice";
 

const authInitialState = {
  authLog: {
    email: null,
    uid: null,
    currentUser: null
  },
  logStatus: false,
}

export const authSlice = createSlice(
  {
  name: "auth", 
  initialState: authInitialState,
  reducers: {

    registerUSER: (state, action) => {
      const { email, uid, pass, displayName, admin, role, canDo } = action.payload;
      state.uid = uid;
      state.email = email;
      state.displayName = displayName; 
      state.createdBy = pass;
      state.admin = admin;
      state.role = role;
      state.canDo = canDo;

      if (pass === "googlepopup") {
        state.emailVerified = true;
      } else {
        state.emailVerified = false;
      }       
      

      // CREATE TIME
      const addZero = (str) => {
        let string = "";
        if (str.length < 2) {
          string = "0" + str;     
        } else {
          string = str;      
        }    
        return string;
      }
      const createDate = new Date();
      const createDatePlain = addZero(String(createDate.getDate())) + "-" + addZero(String(createDate.getMonth() + 1)) + "-" + String(createDate.getFullYear());
      const createTimePlain = addZero(String(createDate.getHours())) + ":" + addZero(String(createDate.getMinutes()));

      const createTime = {
        dateISO: createDate.toISOString(),
        datePlain: createDatePlain,
        timePlain: createTimePlain
      }
      
      //  ARANGING DATA TO BE TRANSPORTED
      const userData = {
        uid: state.uid,        
        email: state.email,
        displayName: state.displayName,
        createdBy: state.createdBy,

        likes: [],
        carts: [],
        orderHistory: [],
        addresses: [],
        pendingOrders: [],

        username: null,
        emailVerified: state.emailVerified,
        verificationAlert: false,
        basicDone: false,
        createTime: createTime,

        admin: state.admin,
        role: state.role,
        canDo: state.canDo
      }
      //STORING DATA IN FIRESTORE
      try { 
        setDoc(doc(db, "userData", state.uid), userData); 
        state.logStatus = true;
      } catch (error) { 
        console.error(error.code);
        console.error(error.message);
      }
    }, 

    loginUSER: (state, action) => {
      state.logStatus = true;
    },

    loginSTATE: (state, action) => {
      state.authLog = {
        email: action.payload.stateEmail,
        uid: action.payload.stateUid,
        currentUser: action.payload.stateCurrentUser
      };
      state.logStatus = true;
    },

    //NOT BEING USED FOR NOW
    initSTATE: (state, action) => {
      state.authLog = {
        email: null,
        uid: null,
        currentUser: null
      };
      state.logStatus = false;
    },

    logoutUSER: (state, action) => {
      state.logStatus = false;
      state.email = null;
      state.username = null;
      state.formName = null;
      state.uid = null;
    }
  }
});

export const { setActiveUSER, logoutUSER, loginSTATE, registerUSER, loginUSER, initSTATE } = authSlice.actions;

export const authPassLogs = {
  rdxAuthPass: (state) => state.auth.logStatus
}

// export const userDataSelector = {
//   rdxFullData: (state) => state.userData.currentUserData,
//   isLoading: (state) => state.userData.loading === 'pending',
//   error: (state) => state.userData.error,
// };

