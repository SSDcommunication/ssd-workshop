import DashboardLayout from '@/components/ui/DashboardLayout'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Témoignages - Workshop Manager',
}

export default function TestimonialsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Témoignages</h1>
        <div className="flex gap-4 mb-8">
          <button className="btn-primary">+ Ajouter témoignage</button>
          <button className="btn-secondary">📋 Importer</button>
        </div>
        <Card title="Témoignages collectés">
          <p className="text-gray-600 text-center py-8">Aucun témoignage pour le moment</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
