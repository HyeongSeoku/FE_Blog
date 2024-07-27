import { useEffect } from "react";
import useUserStore, { UserProps } from "store/user";
import { deepEqual } from "utils/object";

const useSyncUserStore = (user: UserProps) => {
  const { userStore, setUserStore, initializeUserStore } = useUserStore();

  useEffect(() => {
    if (!user) {
      initializeUserStore();
    } else if (!deepEqual(user, userStore)) {
      setUserStore(user);
    }
  }, [user, userStore, setUserStore, initializeUserStore]);
};

export default useSyncUserStore;
