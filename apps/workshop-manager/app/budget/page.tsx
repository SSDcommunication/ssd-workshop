import DashboardLayout from '@/components/ui/DashboardLayout'
import BudgetManager from '@/components/modules/BudgetManager'

export const metadata = {
  title: 'Budget - Workshop Manager',
}

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <BudgetManager />
    </DashboardLayout>
  )
}
