import DashboardLayout from '@/components/ui/DashboardLayout'
import OutreachManager from '@/components/modules/OutreachManager'

export const metadata = {
  title: 'Prospection - Workshop Manager',
}

export default function OutreachPage() {
  return (
    <DashboardLayout>
      <OutreachManager />
    </DashboardLayout>
  )
}
