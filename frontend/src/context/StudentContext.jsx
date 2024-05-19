import React from 'react'
import {createContext, useContext, useState} from "react";
import {StudentApi} from  "../services/Api/User"

export const StudentStateContext = createContext({
  user: {},
  authenticated: false,
  login: (email, password) => {
  },
 
  setUser: () => {
  },
  logout: () => {
  },
  setAuthenticated: () => {
  },
  setToken: () => {
  },


})

export default function StudentContext({children}) {
    const [user, setUser] = useState({ })
    const [authenticated, _setAuthenticated] = useState('true' === window.localStorage.getItem('AUTHENTICATED'))
    // const navigate = useNavigate();



    const login = async (email, password) => {
      return StudentApi.login(email, password)
    }
    const logout = () => {
      setUser({})
      setAuthenticated(false)
      setToken()
      }
      const setAuthenticated = (isAuthenticated) => {
        _setAuthenticated(isAuthenticated)
        window.localStorage.setItem('AUTHENTICATED', isAuthenticated)
      }
      const setToken = (token) => {
        window.localStorage.setItem('token', token)
      }
    
  return (
    <>
    <StudentStateContext.Provider value={{

user,
login,
logout,
setUser,
authenticated,
setAuthenticated,
setToken
    
      }}>
        {children}
      </StudentStateContext.Provider>
      </>
  )
}
export const useUserContext = () => useContext(StudentStateContext)