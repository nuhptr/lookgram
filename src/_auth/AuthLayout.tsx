import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
   const isAuthenticated = false

   return (
      <>
         {isAuthenticated ? (
            // If auth redirect to home
            <Navigate to="/" />
         ) : (
            // If not auth show auth pages
            <>
               {/* main content */}
               <section className="flex flex-col items-center justify-center flex-1 py-10">
                  <Outlet />
               </section>
               {/* side image content */}
               <img
                  src="/images/side-img.svg"
                  alt="Logo"
                  className="hidden object-cover w-1/2 h-screen bg-no-repeat lg:block"
               />
            </>
         )}
      </>
   )
}

export default AuthLayout
