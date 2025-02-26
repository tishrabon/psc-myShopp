import { useSelector } from "react-redux";

export const FalseShows = ({ children }) => {

  const pass = useSelector(state => state.auth.logStatus);

  if (!pass) {
    return children;
  }
  return null;
}

