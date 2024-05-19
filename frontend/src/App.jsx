import {RouterProvider} from "react-router-dom";
import {router} from "./router/index.jsx";

import './App.css'
import UserContext from "./context/StudentContext.jsx";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import { Toaster } from "sonner";

function App() {

  return (
    <>
    <UserContext>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
    
     <RouterProvider router={router}/>
     </ThemeProvider>
     <Toaster />

     </UserContext>
    </>
  )
}

export default App
