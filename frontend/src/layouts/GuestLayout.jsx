import {Link, Outlet, useNavigate} from "react-router-dom";
import Logo from "../components/Logo.jsx";
import {LOGIN_ROUTE, STUDENT_DASHBOARD_ROUTE} from "../router/index.jsx";
import {useEffect} from "react";
import {HomeIcon, LogInIcon} from 'lucide-react'
import {useUserContext} from "@/context/StudentContext.jsx";


export default function GuestLayout() {
    const navigate = useNavigate();
    const context = useUserContext()

   useEffect( ()=>{
        if(context.authenticated){
            
        navigate(STUDENT_DASHBOARD_ROUTE)
        } 
    }  ,[])
    

  return <>
    <header>
      <div
        className="items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mb-4 mx-auto shadow-2xl">
        <div className="text-2xl text-white font-semibold inline-flex items-center">
          <Logo/>
        </div>
        <div>
          <ul className="flex text-white">
            <li className="ml-5 px-2 py-1">
              <Link className={'flex'} to={'/'}><HomeIcon className={'mx-1'}/> Home page</Link>
            </li>
            <li className="ml-5 px-2 py-1">
              <Link className={'flex'} to={LOGIN_ROUTE}><LogInIcon className={'mx-1'}/> Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main className={'container'}>
      <Outlet/>
    </main>
  </>
}