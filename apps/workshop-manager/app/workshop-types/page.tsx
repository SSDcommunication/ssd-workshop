import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopTypesManager from '@/components/modules/WorkshopTypesManager'

export const metadata = {
  title: 'Types d\'ateliers - Workshop Manager',
}

export default function WorkshopTypesPage() {
  return (
    <DashboardLayout>
      <WorkshopTypesManager />
    </DashboardLayout>
  )
}
