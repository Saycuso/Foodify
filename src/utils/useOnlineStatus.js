import { useEffect, useState } from "react";

const useOnlineStatus = () => {
  const [isOnline, setisOnline] = useState(true);
 0
  // check if online
  useEffect(() => {
    window.addEventListener("offline", () => {
      setisOnline(false);
    });

    window.addEventListener("online", () => {
      setisOnline(true);
    });
  }, []);

  //boolean value
  return isOnline;
};

export default useOnlineStatus;
