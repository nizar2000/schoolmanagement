import React, { useEffect, useState } from 'react'

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
import { axiosClient } from "../../../api/axios"
import {Loader} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import { Textarea } from '@/components/ui/textarea'
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.jsx";
import {toast} from "sonner";
import ParentApi from '@/services/Api/Admin/ParentApi'



"use client"
 

 
const formSchema = z.object({
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.string().max(1),
  blood_type: z.string(),
  address: z.string().max(255),
  phone: z.string().max(10),
  email: z.string().email().min(2).max(50),
  password:z.string().min(8).max(50),
})


export default function ParentCreateForm({handleSubmit,values}) {

  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    address: '',
    password: '',
    phone: '',
    ...values // If values are provided, they will override the default values
  };

  const [parents, setParents] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = values !== undefined;

  useEffect(() => {
    ParentApi.all().then(({ data }) => {
      setParents(data.data);
    });
  }, []);

  const onSubmit = async (data) => {
    const loaderMsg = isUpdate ? 'Updating in progress.' : 'Adding parent';
    const loader = toast.loading(loaderMsg);

    await handleSubmit(data).then(
      ({ status, data }) => {
        if (status === 200) {
          toast.success(data.message);
          console.log(data)
          reset();
        }
      }
    ).catch((errorResponse) => {
      const { errors } = errorResponse.response.data;
      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        setError(fieldName, {
          message: errorMessages.join(', '),
        });
      });
    }).finally(() => {
      toast.dismiss(loader);
    });
  };

  return <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="firstname"
          render={({field}) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Firstname" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({field}) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Lastname" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({field}) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input type={'date'} placeholder="Date of birth" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({field}) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="m"/>
                    </FormControl>
                    <FormLabel className="font-normal">
                      Male
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="f"/>
                    </FormControl>
                    <FormLabel className="font-normal">
                      Female
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blood_type"
          render={({field}) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Type"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bloodType, key) =>
                    <SelectItem key={key} value={bloodType}>{bloodType}</SelectItem>)
                  }
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({field}) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          type={'tel'}
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="Password" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className={'mt-2'} type="submit">
          {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '}
          {isUpdate ? 'Update': 'Create'}
        </Button>
      </form>
    </Form>
  </>
}