import DashboardLayout from '@/components/ui/DashboardLayout'
import TaskManager from '@/components/modules/TaskManager'

export const metadata = {
  title: 'Tâches - Workshop Manager',
}

export default function TasksPage() {
  return (
    <DashboardLayout>
      <TaskManager />
    </DashboardLayout>
  )
}
