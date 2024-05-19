import {Link, Outlet, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, STUDENT_DASHBOARD_ROUTE} from "@/router/index";
import {HomeIcon, LogInIcon} from 'lucide-react'
import { useEffect,useState } from "react";
import { axiosClient } from "@/api/axios"
import {useUserContext} from "@/context/StudentContext";
import StudentApi from "@/services/Api/User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StudentAdministrationSidebar } from "./Administration/StudentAdministrationSidebar";
import { ModeToggle } from "@/components/mode-toggle";


export default function StudentDashboardLayout() {
    const navigate = useNavigate();
    const {authenticated, setUser, setAuthenticated, logout: contextLogout} = useUserContext()
    const token = window.localStorage.getItem('token')

    useEffect(() => {
      if (authenticated === true) {
        axiosClient.get('/user', {
          headers : {
              Authorization: `Bearer ${token}`,
          },
      } 
         ).then(({data}) => {
          setUser(data)
          setAuthenticated(true)
        }).catch((err) => {
          console.log(err)
         contextLogout()
        navigate(LOGIN_ROUTE)
        })
      } else {
       navigate(LOGIN_ROUTE)
      }
  
    }, [authenticated,token]);
    
    const logout = async () => {
      try {
        // Make a POST request to the logout endpoint with the authorization token
        const response = await axiosClient.post('/logout', {}, // here is supposed to be `data`
  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
        });
    
        // Check if the request was successful (status code 2xx)
        if (response.status >= 200 && response.status < 300) {
          // If logout is successful, perform logout action and navigate to login route
          contextLogout();
          navigate(LOGIN_ROUTE);
        } else {
          // Handle other status codes if needed
          console.error('Logout  failed:', response.statusText);
        }
      } catch (error) {
        // Handle any errors, such as network issues or unexpected server responses
        console.error('Logout failed:', error.message);
      }
    };
    
    
    return <>
    <header>
      <div
        className="items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mb-4 mx-auto shadow-2xl">
        <div className="text-2xl text-white font-semibold inline-flex items-center">
        </div>
        <div>
          <ul className="flex text-white">
            <li className="ml-5 px-2 py-1">
              <Link className={'flex'} to={'/'}><HomeIcon className={'mx-1'}/> Home page</Link>
            </li>
            <li className="ml-5 px-2 py-1">
            <DropdownMenu>
          <DropdownMenuTrigger>About</DropdownMenuTrigger>
             <DropdownMenuContent>
       <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
       <DropdownMenuItem>Profile</DropdownMenuItem>
       <DropdownMenuItem onClick={logout}>logout</DropdownMenuItem>
     </DropdownMenuContent>
         </DropdownMenu>

              
            </li>
            <li className="ml-5 px-2 py-1">
              <ModeToggle/>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main className={'mx-auto px-10 space-y-4 py-4'}>
      <div className="flex">
        <div className={'w-full md:w-2/12 border mr-2 rounded-l'}>
          <StudentAdministrationSidebar/>
        </div>
        <div className={'w-full md:w-10/12 border rounded-l'}>
          <Outlet/>
        </div>
      </div>
    </main>
  </>
}
