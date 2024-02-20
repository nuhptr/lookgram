import { Routes, Route } from "react-router-dom"

import "./globals.css"

import SignInForm from "@/_auth/forms/SignInForm"
import SignUpForm from "@/_auth/forms/SignUpForm"
import AuthLayout from "@/_auth/AuthLayout"
import RootLayout from "@/_root/RootLayout"

import { Home } from "@/_root/pages"

const App = () => {
   return (
      <main className="flex h-screen">
         <Routes>
            {/* Public Routes  */}
            <Route element={<AuthLayout />}>
               {/* Wrapping Layout */}
               <Route path="/sign-up" element={<SignUpForm />} />
               <Route path="/sign-in" element={<SignInForm />} />
            </Route>

            {/* Private Routes */}
            <Route element={<RootLayout />}>
               {/* Wrapping Layout */}
               <Route index element={<Home />} />
            </Route>
         </Routes>
      </main>
   )
}

export default App
