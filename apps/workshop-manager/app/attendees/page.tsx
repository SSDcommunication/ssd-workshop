import DashboardLayout from '@/components/ui/DashboardLayout'
import AttendeeManager from '@/components/modules/AttendeeManager'

export const metadata = {
  title: 'Inscrits - Workshop Manager',
}

export default function AttendeesPage() {
  return (
    <DashboardLayout>
      <AttendeeManager />
    </DashboardLayout>
  )
}
