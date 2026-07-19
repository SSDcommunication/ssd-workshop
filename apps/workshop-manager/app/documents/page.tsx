import DashboardLayout from '@/components/ui/DashboardLayout'
import DocumentsManager from '@/components/modules/DocumentsManager'

export const metadata = {
  title: 'Documents - Workshop Manager',
}

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <DocumentsManager />
    </DashboardLayout>
  )
}
