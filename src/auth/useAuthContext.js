import { useContext } from "react";
import { AuthContext } from "./AppwriteContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext context must be use inside AuthProvider");

  return context;
};
