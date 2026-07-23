import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#4dd1e3] to-[#4dd1e3]/80">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Workshop Manager</h1>
          <p className="text-xl text-white/90 mb-8">
            Gérez vos ateliers de A à Z
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login" className="btn-primary bg-white text-[#4dd1e3]">
              Connexion
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
