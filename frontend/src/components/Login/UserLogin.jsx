import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { axiosClient } from "../../api/axios"
import { useNavigate } from 'react-router-dom';
import {Loader} from "lucide-react";
import {
  ADMIN_DASHBOARD_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  
} from "../../router/index.jsx";
import {useUserContext} from "@/context/StudentContext.jsx";


"use client"
 

 
const formSchema = z.object({
  email: z.string().email().min(2).max(50),
  password:z.string().min(8).max(50),
})

export default function UserLogin() {
  
  const { setAuthenticated, setToken} = useUserContext()

  const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "test@example.com",
          password:"12345678",
        },
      })
      const {setError, formState: {isSubmitting}} = form

      const onSubmit = async (values) => {
        try {
          const response = await axiosClient.post('/login', values);
      
          if (response.status === 200) {
         // navigate(STUDENT_DASHBOARD_ROUTE)
           console.log(response)
           setToken(response.data.token)
          // window.localStorage.setItem('token',response.data.access_token)
           setAuthenticated(true)
           const role = response.data.user.role
            switch (role){
              case "student":
              navigate(STUDENT_DASHBOARD_ROUTE);
              break;
              case "admin":
                navigate(ADMIN_DASHBOARD_ROUTE)
                break;
               
            }
          }
        } catch (error) {
          console.log(error)
          if (error.response && error.response.data.error) {
            const { response } = error;
            setError('email', {
              message: response.data.errors.email.join()
            });
          }
        }
      };
      
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
          <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>password</FormLabel>
            <FormControl>
              <Input type={"password"} placeholder="Password" {...field} />
            </FormControl>
       
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={isSubmitting} type="submit">
      {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '} Login
      </Button>
    </form>
  </Form>
  )
}
