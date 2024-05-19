import {axiosClient} from "../../../api/axios.js";
const token = window.localStorage.getItem('token')

const ParentApi = {
  create: async (payload) => {
    return await axiosClient.post('/admin/parents', payload , {
    
      
              headers: {
                Authorization: `Bearer ${token}`,
              },
    })
  },
  update: async (id, payload) => {
    return await axiosClient.put(`/admin/parents/${id}`, {...payload, id}, {
     
      
              headers: {
                Authorization: `Bearer ${token}`,
              },
    })
  },
  delete: async (id) => {
    return await axiosClient.delete(`/admin/parents/${id}`, {
     
      
              headers: {
                Authorization: `Bearer ${token}`,
              },
    })
  },
  all: async (columns = []) => {
    return await axiosClient.get('/admin/parents', {
      params: {
        columns: columns
      },
      
              headers: {
                Authorization: `Bearer ${token}`,
              },
    })
  },
}
export default ParentApi