import DashboardLayout from '@/components/ui/DashboardLayout'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Programme - Workshop Manager',
}

export default function WorkshopProgramPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Programme de l'atelier</h1>
        <Card title="Timeline de la session">
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">À développer : vue timeline interactif des sessions</p>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Fonctionnalités prévues :</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Heure début/fin</li>
                <li>Titre de la session</li>
                <li>Intervenant</li>
                <li>Matériel requis</li>
                <li>Salle/Plateforme</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
