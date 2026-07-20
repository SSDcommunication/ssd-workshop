import DashboardLayout from '@/components/ui/DashboardLayout'
import WorkshopsList from '@/components/modules/WorkshopsList'

export const metadata = {
  title: 'Ateliers - Workshop Manager',
}

export default function WorkshopsPage() {
  return (
    <DashboardLayout>
      <WorkshopsList />
    </DashboardLayout>
  )
}
