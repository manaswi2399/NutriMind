import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";

type ThemeContextValue = {
  mode: Mode;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "nutrimind_theme_mode_v1";

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>("light");

  // initial mode: from localStorage or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved === "light" || saved === "dark") {
        setMode(saved);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setMode("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  // whenever mode changes: persist + toggle Tailwind's `dark` class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // MUI theme synced with mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        shape: {
          borderRadius: 16,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used inside ThemeContextProvider");
  }
  return ctx;
};
