import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://borlrlqkfdgrtrwbsqti.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcmxybHFrZmRncnRyd2JzcXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MjQ1NDgsImV4cCI6MjA4MDAwMDU0OH0.iJvNys8ZFn214mA-Vr7xwG8bW37qKK8q1KN_x0GGCGA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUser() {
  const email = 'admin@transpetro.com.br'
  const password = 'admin123'

  console.log(`Attempting to create user: ${email}...`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Error creating user:', error.message)
  } else {
    console.log('User creation response:', data)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        console.log('User already exists (or requires confirmation).')
    } else {
        console.log('User created successfully (check email for confirmation if required).')
    }
    console.log('Credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
  }
}

createUser()
