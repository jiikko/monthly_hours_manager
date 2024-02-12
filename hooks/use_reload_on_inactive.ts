import { useEffect, useState } from "react";

export const useReloadOnInactive = () => {
  const [inactiveSince, setInactiveSince] = useState(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setInactiveSince(Date.now());
      } else if (document.visibilityState === "visible") {
        if (inactiveSince && Date.now() - inactiveSince > 5 * 60 * 1000) {
          window.location.reload();
        } else {
          console.log("Inactive for less than 5 minutes");
          setInactiveSince(null);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [inactiveSince]);
};
