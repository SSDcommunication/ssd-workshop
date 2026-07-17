import DashboardLayout from '@/components/ui/DashboardLayout'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Prospection - Workshop Manager',
}

export default function OutreachPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Prospection & Partenariats</h1>
        <button className="btn-primary mb-8">+ Ajouter contact</button>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-gray-600 text-sm mb-2">Nouveaux contacts</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">En discussion</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">Confirmés</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </Card>
        </div>

        <Card title="Contacts de prospection">
          <p className="text-gray-600 text-center py-8">Aucun contact pour le moment</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
