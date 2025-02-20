import { useContext } from "react";
import { ContentContext } from "./ContentProvider";

export const useContent = () => {
  const context = useContext(ContentContext);

  if (!context)
    throw new Error("useContent context must be used inside ContentProvider");

  return context;
};
