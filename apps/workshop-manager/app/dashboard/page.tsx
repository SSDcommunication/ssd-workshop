import DashboardLayout from '@/components/ui/DashboardLayout'
import Dashboard from '@/components/modules/Dashboard'

export const metadata = {
  title: 'Dashboard - Workshop Manager',
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
}
