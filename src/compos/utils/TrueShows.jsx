import { useSelector } from "react-redux";

export const TrueShows = ({ children }) => {

  const pass = useSelector(state => state.auth.logStatus);
 
  if (pass) {
    return children;
  }
  return null;
}

