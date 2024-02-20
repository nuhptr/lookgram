import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loader from "@/components/shared/Loader"

import { SignupValidation } from "@/lib/validation"
import { createUserAccount } from "@/lib/appwrite/api"

export default function SignUpForm() {
   const isLoading = false

   // 1. Define your form.
   const form = useForm<z.infer<typeof SignupValidation>>({
      resolver: zodResolver(SignupValidation),
      defaultValues: { name: "", username: "", email: "", password: "" },
   })

   // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof SignupValidation>) {
      const newUser = await createUserAccount(values)

      console.log(newUser)
   }

   return (
      <Form {...form}>
         <div className="flex-col sm:w-420 flex-center">
            <img src="/images/logo.svg" alt="Logo lookgram" />

            <h2 className="pt-5 h3-bold md:h2-bold sm:pt-12">Create a new account</h2>
            <p className="mt-2 text-light-3 small-medium md:base-regular">
               To use snapgram, please enter your account details
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_label">Name</FormLabel>
                        <FormControl>
                           <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_label">Username</FormLabel>
                        <FormControl>
                           <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_label">Email</FormLabel>
                        <FormControl>
                           <Input type="email" className="shad-input" {...field} />
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
                        <FormLabel className="shad-form_label">Password</FormLabel>
                        <FormControl>
                           <Input type="password" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="shad-button_primary">
                  {isLoading ? (
                     <div className="gap-2 flex-center">
                        <Loader /> Loading...
                     </div>
                  ) : (
                     "Sign up"
                  )}
               </Button>

               <p className="mt-2 text-center small-regular text-light-2">
                  Already have an account?
                  <Link to="sign-in" className="ml-1 text-primary-500 small-semibold">
                     Log in
                  </Link>
               </p>
            </form>
         </div>
      </Form>
   )
}
