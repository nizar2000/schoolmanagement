import {axiosClient} from "@/api/axios";
const token = window.localStorage.getItem('token')


export const StudentApi = {

   
  login: async (email, password) => {
    return await axiosClient.post('/login', {email, password})
  },
  logout: async () => {
    return await axiosClient.post('/logout',{
      headers : {
          Authorization: `Bearer ${token}`,
      },
  } 
    )
  },

  getUser: async () => {
    return await axiosClient.get('/user',{
        headers : {
            Authorization: `Bearer ${token}`,
        },
    } 
       
      )
        
  },
}
export default StudentApi;