import DashboardLayout from '@/components/ui/DashboardLayout'
import EmailCampaignManager from '@/components/modules/EmailCampaignManager'

export const metadata = {
  title: 'Campagnes Email - Workshop Manager',
}

export default function EmailCampaignsPage() {
  return (
    <DashboardLayout>
      <EmailCampaignManager />
    </DashboardLayout>
  )
}
