import { INewUser } from "@/types"
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createUserAccount, signInAccount } from "../appwrite/api"

export function useCreateUserAccountMutation() {
   return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user),
   })
}

export function useSignInAccount() {
   return useMutation({
      mutationFn: (user: { email: string; password: string }) => signInAccount(user),
   })
}
