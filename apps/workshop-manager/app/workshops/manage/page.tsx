import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsManager from '@/components/modules/WorkshopsManager'

export const metadata = {
  title: 'Créer/Modifier les ateliers - Workshop Manager',
}

export default function WorkshopsManagePage() {
  return (
    <DashboardLayout>
      <WorkshopsManager />
    </DashboardLayout>
  )
}
