import { z } from 'zod'

interface DBUser {
  id: number
  name: string
  email: string
  password: string
  avatar: string
}

export default defineEventHandler(async (event) => {
  const db = useDatabase()
  
  const { name, email, password } = await readValidatedBody(event, z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(8),
  }).parse)

  const hashedPassword = await hashPassword(password)

  const avatar = ''

  await db.sql`INSERT INTO users(name, email, password, avatar) VALUES (${name}, ${email}, ${hashedPassword}, ${avatar})`

  // In real applications, you should send a confirmation email to the user before logging them in.
  const user = await db.sql<{ rows: DBUser[] }>`SELECT * FROM users WHERE email = ${email}`.then(result => result.rows[0])

  await setUserSession(event, {
    user: {
      name:user.name,
      email:user.email,
      avatar:user.avatar,
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})
