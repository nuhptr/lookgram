import { ID, Query } from "appwrite"

import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import { account, appwriteConfig, avatars, database, storage } from "@/lib/appwrite/config"

// ============================================================
// AUTHENTICATION
// ============================================================
//* CREATE USER ACCOUNT
export async function createUserAccount(user: INewUser) {
   try {
      const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

      if (!newAccount) throw new Error("Account not created")

      const avatarUrl = avatars.getInitials(user.name)
      const newUser = await saveUserToDB({
         accountId: newAccount.$id,
         name: newAccount.name,
         email: newAccount.email,
         username: user.username,
         imageUrl: avatarUrl,
      })

      return newUser
   } catch (error) {
      console.error(error)
      return error
   }
}

//* SAVE USER TO DATABASE
export async function saveUserToDB(user: {
   accountId: string
   email: string
   name: string
   imageUrl: URL
   username?: string
}) {
   try {
      const newUser = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user
      )

      return newUser
   } catch (error) {
      console.error(error)
   }
}

//* SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
   try {
      const session = await account.createEmailSession(user.email, user.password)

      return session
   } catch (error) {
      console.error(error)
   }
}

//* GET ACCOUNT
export async function getAccount() {
   try {
      const currentAccount = await account.get()

      return currentAccount
   } catch (error) {
      console.error(error)
   }
}

//* GET CURRENT USER
export async function getCurrentUser() {
   try {
      const currentAccount = await getAccount()

      if (!currentAccount) throw new Error("Account not found")

      const currentUser = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal("accountId", currentAccount.$id)]
      )

      if (!currentUser) throw new Error("User not found")

      return currentUser.documents[0]
   } catch (error) {
      console.log(error)
      return null
   }
}

//* SIGN OUT
export async function signOutAccount() {
   try {
      const signOut = await account.deleteSession("current")

      return signOut
   } catch (error) {
      console.error(error)
   }
}

//** POST QUERY */
//* UPLOAD FILE
export async function uploadFile(file: File) {
   try {
      const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file)

      return uploadedFile
   } catch (error) {
      console.error(error)
   }
}

//* GET FILE URL
export async function getFilePreview(fileId: string) {
   try {
      const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top", 100)
      if (!fileUrl) throw new Error("File url not found")

      return fileUrl
   } catch (error) {
      console.error(error)
   }
}

//* DELETE FILE
export async function deleteFile(fileId: string) {
   try {
      await storage.deleteFile(appwriteConfig.storageId, fileId)

      return { success: true, message: "File deleted" }
   } catch (error) {
      console.error(error)
   }
}

// ============================================================
// POST
// ============================================================
//* CREATE POST
export async function createPost(post: INewPost) {
   try {
      // upload image to storage
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw new Error("File not uploaded")

      // get file url
      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
         await deleteFile(uploadedFile.$id)
         throw new Error("File url not found")
      }

      // convert tags to array
      const tags = post.tags?.replace(/ /g, "").split(",") || []

      // create post
      const newPost = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
         }
      )

      if (!newPost) {
         await deleteFile(uploadedFile.$id)
         throw new Error("Post not created")
      }

      return newPost
   } catch (error) {
      console.error(error)
   }
}

//* GET POSTS
export async function searchPosts(searchTerm: string) {
   try {
      const posts = await database.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [
         Query.search("caption", searchTerm),
      ])
      if (!posts) throw new Error("Posts not found")

      return posts
   } catch (error) {
      console.log(error)
   }
}

//* GET INFINITE POSTS
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
   const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)]

   if (pageParam) queries.push(Query.cursorAfter(pageParam.toString()))

   try {
      const posts = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         queries
      )

      if (!posts) throw new Error("Posts not found")

      return posts
   } catch (error) {
      console.log(error)
   }
}

//* GET POST BY ID
export async function getPostById(postId?: string) {
   if (!postId) throw new Error("Post id not found")

   try {
      const post = await database.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      )

      if (!post) throw new Error("Post not found")

      return post
   } catch (error) {
      console.log(error)
   }
}

//* UPDATE POST
export async function updatePost(post: IUpdatePost) {
   const hasFileToUpdate = post.file.length > 0

   try {
      let image = { imageUrl: post.imageUrl, imageId: post.imageId }

      if (hasFileToUpdate) {
         // Upload new file to appwrite storage
         const uploadedFile = await uploadFile(post.file[0])
         if (!uploadedFile) throw new Error("File not uploaded")

         // Get new file url
         const fileUrl = await getFilePreview(uploadedFile.$id)
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw new Error("File url not found")
         }

         image = {
            ...image,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
         }
      }

      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || []

      //  Update post
      const updatedPost = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         post.postId,
         {
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags,
         }
      )

      // Failed to update
      if (!updatedPost) {
         // Delete new file that has been recently uploaded
         if (hasFileToUpdate) await deleteFile(image.imageId)
         // If no new file uploaded, just throw error
         throw new Error("Post not updated")
      }

      // Safely delete old file after successful update
      if (hasFileToUpdate) await deleteFile(post.imageId)

      return updatedPost
   } catch (error) {
      console.log(error)
   }
}

//* DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
   if (!postId || !imageId) return null

   try {
      const statusCode = await database.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      )

      if (!statusCode) throw new Error("Post not deleted")

      await deleteFile(imageId)

      return { status: "OK", message: "Post deleted" }
   } catch (error) {
      console.log(error)
   }
}

//* LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
   try {
      const updatedPost = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
         { likes: likesArray }
      )

      if (!updatedPost) throw new Error("Post not updated")

      return updatedPost
   } catch (error) {
      console.log(error)
   }
}

//* SAVE POST
export async function savePost(userId: string, postId: string) {
   try {
      const updatedPost = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         ID.unique(),
         { user: userId, post: postId }
      )

      if (!updatedPost) throw new Error("Post not saved")

      return updatedPost
   } catch (error) {
      console.log(error)
   }
}

//* DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
   try {
      const statusCode = await database.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         savedRecordId
      )

      if (!statusCode) throw new Error("Saved post not deleted")

      return { status: "OK", message: "saved post deleted" }
   } catch (error) {
      console.log(error)
   }
}

//* GET USER'S POST
export async function getUserPosts(userId?: string) {
   if (!userId) return null

   try {
      const post = await database.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [
         Query.equal("creator", userId),
         Query.orderDesc("$createdAt"),
      ])

      if (!post) throw new Error("Post not found")

      return post
   } catch (error) {
      console.log(error)
   }
}

//* GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
   try {
      const posts = await database.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [
         Query.orderDesc("$createdAt"),
         Query.limit(20),
      ])

      if (!posts) throw new Error("Posts not found")

      return posts
   } catch (error) {
      console.log(error)
   }
}

// ============================================================
// USER
// ============================================================
//* GET USERS
export async function getUsers(limit?: number) {
   const queries = [Query.orderDesc("$createdAt")]

   if (limit) queries.push(Query.limit(limit))

   try {
      const users = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         queries
      )

      if (!users) throw new Error("Users not found")

      return users
   } catch (error) {
      console.log(error)
   }
}

//* GET USER BY ID
export async function getUserById(userId: string) {
   try {
      const user = await database.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         userId
      )

      if (!user) throw new Error("User id not found")

      return user
   } catch (error) {
      console.log(error)
   }
}

//* UPDATE USER
export async function updateUser(user: IUpdateUser) {
   const hasFileToUpdate = user.file.length > 0

   try {
      let image = { imageUrl: user.imageUrl, imageId: user.imageId }

      if (hasFileToUpdate) {
         // Upload new file to appwrite storage
         const uploadedFile = await uploadFile(user.file[0])
         if (!uploadedFile) throw new Error("File not uploaded")

         // Get new file url
         const fileUrl = await getFilePreview(uploadedFile.$id)
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw new Error("File url not found")
         }

         image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
      }

      //  Update user
      const updatedUser = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         user.userId,
         { name: user.name, bio: user.bio, imageUrl: image.imageUrl, imageId: image.imageId }
      )

      // Failed to update
      if (!updatedUser) {
         // Delete new file that has been recently uploaded
         if (hasFileToUpdate) await deleteFile(image.imageId)
         // If no new file uploaded, just throw error
         throw new Error("User not updated")
      }

      // Safely delete old file after successful update
      if (user.imageId && hasFileToUpdate) await deleteFile(user.imageId)

      return updatedUser
   } catch (error) {
      console.log(error)
   }
}
