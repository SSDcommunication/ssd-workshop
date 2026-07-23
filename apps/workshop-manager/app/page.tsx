import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  // TODO: Check authentication here
  // For now, redirect to workshops for testing
  redirect('/workshops')
}
