import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

function page() {
  return <LoginForm/>
}

export default page


export async function generateMetadata() {
  return {
    title: "Login",
    description: "Jaya Green Kost",
  };
}