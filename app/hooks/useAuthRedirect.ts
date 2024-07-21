import { useEffect } from "react";
import { useRouter } from "expo-router";
import { isTokenValid } from "../utils/jwt";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const valid = await isTokenValid();
      if (valid) {
        router.replace("/home");
      }
    };

    checkToken();
  }, [router]);
};

export default useAuthRedirect;
