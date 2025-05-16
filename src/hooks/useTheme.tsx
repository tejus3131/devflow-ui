import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { useContext } from "react";

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme hook must be used within a ThemeProvider component. " +
      "Make sure you have wrapped your application or component tree with ThemeProvider."
    );
  }
  return context;
}