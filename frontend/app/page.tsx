import ComplaintForm from "@/components/complaint-form"
import SettingsMenu from "@/components/settings-menu"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SettingsMenu />
      <ComplaintForm />
    </main>
  )
}
