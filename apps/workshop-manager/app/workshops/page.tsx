import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopManager from '@/components/modules/WorkshopManager'

export const metadata = {
  title: 'Ateliers - Workshop Manager',
}

export default function WorkshopsPage() {
  return (
    <DashboardLayout>
      <WorkshopManager />
    </DashboardLayout>
  )
}
