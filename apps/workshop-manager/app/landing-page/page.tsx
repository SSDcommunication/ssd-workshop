import DashboardLayout from '@/components/ui/DashboardLayout'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Landing Page - Workshop Manager',
}

export default function LandingPagePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Landing Page</h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-gray-600 text-sm mb-2">Taux de conversion</p>
            <p className="text-3xl font-bold">--</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">Visiteurs</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm mb-2">Conversions</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
        </div>

        <Card title="Configuration">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input type="url" placeholder="https://" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre SEO
              </label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta description
              </label>
              <textarea className="input-field" rows={3} />
            </div>
            <button type="submit" className="btn-primary">
              Sauvegarder
            </button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
