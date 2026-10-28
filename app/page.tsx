import { DirectoryApp } from "@/features/directory/directory-app";
import { ThemeProvider } from "./theme-provider";

export default function HomePage() {
  return (
    <ThemeProvider>
      <DirectoryApp />
    </ThemeProvider>
  );
}
