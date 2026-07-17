import DashboardLayout from '@/components/ui/DashboardLayout'
import SocialMediaManager from '@/components/modules/SocialMediaManager'

export const metadata = {
  title: 'Réseaux Sociaux - Workshop Manager',
}

export default function SocialMediaPage() {
  return (
    <DashboardLayout>
      <SocialMediaManager />
    </DashboardLayout>
  )
}
