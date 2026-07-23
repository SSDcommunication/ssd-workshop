import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsCreation from '@/components/modules/WorkshopsCreation'

export const metadata = {
  title: 'Configuration des Ateliers - Workshop Manager',
}

export default function WorkshopsPage() {
  return (
    <DashboardLayout>
      <WorkshopsCreation />
    </DashboardLayout>
  )
}
