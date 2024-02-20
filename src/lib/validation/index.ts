import * as z from "zod"

export const SignupValidation = z.object({
   name: z.string().min(2, { message: "Your name to short" }),
   username: z.string().min(2, { message: "Your username too short" }),
   email: z.string().email(),
   password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})
