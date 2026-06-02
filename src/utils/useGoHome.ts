import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/** Client-side navigation to the portfolio homepage (same tab). */
export const useGoHome = () => {
  const navigate = useNavigate();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.top!.location.assign("/");
      return;
    }
    navigate("/", { replace: true });
  }, [navigate]);
};
