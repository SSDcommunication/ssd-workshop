import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsEvents from '@/components/modules/WorkshopsEvents'

export const metadata = {
  title: 'Gestion des Événements - Workshop Manager',
}

export default function WorkshopsEventsPage() {
  return (
    <DashboardLayout>
      <WorkshopsEvents />
    </DashboardLayout>
  )
}
