import DashboardLayout from '@/components/ui/DashboardLayout'
import TestimonialsManager from '@/components/modules/TestimonialsManager'

export const metadata = {
  title: 'Témoignages - Workshop Manager',
}

export default function TestimonialsPage() {
  return (
    <DashboardLayout>
      <TestimonialsManager />
    </DashboardLayout>
  )
}
