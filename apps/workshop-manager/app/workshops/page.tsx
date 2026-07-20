import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsCreationDemo from '@/components/modules/WorkshopsCreationDemo'

export const metadata = {
  title: 'Configuration des Ateliers - Workshop Manager',
}

export default function WorkshopsPage() {
  return (
    <DashboardLayout>
      <WorkshopsCreationDemo />
    </DashboardLayout>
  )
}
