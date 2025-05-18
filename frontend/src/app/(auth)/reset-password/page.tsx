

import ResetPasswordFlow from '@/components/reset-password/ResetPasswordFlow'
import React from 'react'

function page() {
  return <ResetPasswordFlow/>
}

export default page
export async function generateMetadata() {
  return {
    title: "Reset Password",
    description: "Jaya Green Kost",
  }
}