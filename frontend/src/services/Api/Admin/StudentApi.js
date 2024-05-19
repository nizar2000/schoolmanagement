import {axiosClient} from "@/api/axios";
const token = window.localStorage.getItem('token')

const StudentApi = {
  create: async (payload) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axiosClient.post('/admin/students', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Afficher la réponse dans la console
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


  update: async (id, payload) => {
    return await axiosClient.put(`/admin/students/${id}`, {...payload, id},{
        headers : {
            Authorization: `Bearer ${token}`,
        },
    } )
  },
  delete: async (id) => {
    return await axiosClient.delete(`/admin/students/${id}`,{
        headers : {
            Authorization: `Bearer ${token}`,
        },
    } )
  },
  all: async (columns = []) => {
    return await axiosClient.get('/admin/students', {
      params: {
        columns: columns
      },
      
              headers: {
                Authorization: `Bearer ${token}`,
              },
    })
  },
}
export default StudentApi