import DashboardLayout from '@/components/ui/DashboardLayout'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Budget - Workshop Manager',
}

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Budget & P&L</h1>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-gray-600 text-sm mb-2">Revenus totaux</p>
            <p className="text-4xl font-bold text-green-600">0€</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">Coûts totaux</p>
            <p className="text-4xl font-bold text-red-600">0€</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">Profit</p>
            <p className="text-4xl font-bold text-blue-600">0€</p>
          </Card>
        </div>
        <Card title="Détails budget">
          <p className="text-gray-600 text-center py-8">À développer : tableau estimé vs réel</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
