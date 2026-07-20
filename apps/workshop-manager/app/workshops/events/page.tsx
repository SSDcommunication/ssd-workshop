import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsEventsDemo from '@/components/modules/WorkshopsEventsDemo'

export const metadata = {
  title: 'Gestion des Événements - Workshop Manager',
}

export default function WorkshopsEventsPage() {
  return (
    <DashboardLayout>
      <WorkshopsEventsDemo />
    </DashboardLayout>
  )
}
