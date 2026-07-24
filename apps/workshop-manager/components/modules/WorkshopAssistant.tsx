'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'

interface WorkshopInput {
  name: string
  date: string
  time: string
  price: string
  duration: string
  audience: string
  description: string
  benefits: string
  format: string
  location: string
}

interface Task {
  id: string
  title: string
  category: string
  dueDate: string
  status: 'todo' | 'done'
  priority: 'high' | 'medium' | 'low'
}

interface LinkedInPost {
  id: string
  date: string
  content: string
  visualDescription: string
  hashtags: string
}

interface Email {
  id: string
  timing: string
  subject: string
  body: string
}

interface ProspectionAction {
  id: string
  channel: string
  target: string
  action: string
  timing: string
}

const initialWorkshop: WorkshopInput = {
  name: '',
  date: '',
  time: '',
  price: '',
  duration: '',
  audience: '',
  description: '',
  benefits: '',
  format: 'Présentiel',
  location: '',
}

export default function WorkshopAssistant() {
  const [workshop, setWorkshop] = useState<WorkshopInput>(initialWorkshop)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<'input' | 'tasks' | 'linkedin' | 'emails' | 'prospection' | 'landing'>('input')

  const [tasks, setTasks] = useState<Task[]>([])
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([])
  const [emails, setEmails] = useState<Email[]>([])
  const [prospection, setProspection] = useState<ProspectionAction[]>([])
  const [landingPage, setLandingPage] = useState({
    headline: '',
    subheadline: '',
    hero: '',
    benefits: [''],
    testimonials: '',
    cta: '',
    faq: [''],
  })

  const getDateOffset = (baseDate: string, daysBefore: number, hoursBefore: number = 0): string => {
    if (!baseDate) return ''
    const d = new Date(baseDate)
    d.setDate(d.getDate() - daysBefore)
    if (hoursBefore) d.setHours(d.getHours() - hoursBefore)
    return d.toISOString().split('T')[0]
  }

  const generateAll = () => {
    if (!workshop.name || !workshop.date) {
      alert('Veuillez renseigner au minimum le nom et la date de l\'atelier')
      return
    }

    // Tasks generation
    setTasks([
      { id: '1', title: `Créer la landing page pour ${workshop.name}`, category: 'Marketing', dueDate: getDateOffset(workshop.date, 30), status: 'todo', priority: 'high' },
      { id: '2', title: 'Préparer les visuels LinkedIn', category: 'Communication', dueDate: getDateOffset(workshop.date, 21), status: 'todo', priority: 'high' },
      { id: '3', title: 'Rédiger les emails de séquence', category: 'Email', dueDate: getDateOffset(workshop.date, 21), status: 'todo', priority: 'high' },
      { id: '4', title: 'Identifier 50 prospects cibles', category: 'Prospection', dueDate: getDateOffset(workshop.date, 21), status: 'todo', priority: 'medium' },
      { id: '5', title: 'Préparer le support de présentation', category: 'Contenu', dueDate: getDateOffset(workshop.date, 14), status: 'todo', priority: 'high' },
      { id: '6', title: 'Tester le matériel technique', category: 'Logistique', dueDate: getDateOffset(workshop.date, 7), status: 'todo', priority: 'high' },
      { id: '7', title: `Réserver ${workshop.location || 'le lieu'}`, category: 'Logistique', dueDate: getDateOffset(workshop.date, 14), status: 'todo', priority: 'high' },
      { id: '8', title: 'Envoyer email J-7 aux inscrits', category: 'Email', dueDate: getDateOffset(workshop.date, 7), status: 'todo', priority: 'high' },
      { id: '9', title: 'Publier post LinkedIn J-3', category: 'Communication', dueDate: getDateOffset(workshop.date, 3), status: 'todo', priority: 'medium' },
      { id: '10', title: 'Envoyer email de rappel H-1', category: 'Email', dueDate: workshop.date, status: 'todo', priority: 'high' },
      { id: '11', title: 'Post-atelier: envoyer les documents', category: 'Suivi', dueDate: getDateOffset(workshop.date, -1), status: 'todo', priority: 'medium' },
      { id: '12', title: 'Recueillir les témoignages', category: 'Suivi', dueDate: getDateOffset(workshop.date, -7), status: 'todo', priority: 'low' },
    ])

    // LinkedIn posts
    setLinkedinPosts([
      {
        id: '1',
        date: getDateOffset(workshop.date, 21),
        content: `🚀 SAVE THE DATE 🚀\n\n${workshop.name}\n📅 ${workshop.date} ${workshop.time || ''}\n\n${workshop.description}\n\nPour qui ? ${workshop.audience}\n\n👉 Les inscriptions ouvrent bientôt !`,
        visualDescription: 'Visuel teaser: fond aux couleurs de la marque, titre en gros, date visible',
        hashtags: '#formation #workshop #développement',
      },
      {
        id: '2',
        date: getDateOffset(workshop.date, 14),
        content: `📢 Les inscriptions sont OUVERTES !\n\nAtelier: ${workshop.name}\n💰 ${workshop.price}€\n⏱ ${workshop.duration}\n\nCe que vous apprendrez:\n${workshop.benefits}\n\nLien d'inscription en commentaire 👇`,
        visualDescription: 'Carrousel 3 slides: 1) Titre + prix, 2) Bénéfices clés, 3) CTA inscription',
        hashtags: '#inscription #workshop #formation',
      },
      {
        id: '3',
        date: getDateOffset(workshop.date, 7),
        content: `⏰ Plus qu'une semaine avant ${workshop.name} !\n\nDerniers jours pour vous inscrire.\n\n✅ ${workshop.format}\n✅ ${workshop.duration}\n✅ Certificat de participation\n\nQui sera là ? 👋`,
        visualDescription: 'Compte à rebours visuel avec les 3 points clés',
        hashtags: '#lastcall #workshop',
      },
      {
        id: '4',
        date: getDateOffset(workshop.date, 3),
        content: `📆 J-3 avant ${workshop.name}\n\nQuelques places encore disponibles pour ce moment d'apprentissage unique.\n\nRejoignez-nous ! 🎯`,
        visualDescription: 'Visuel J-3 avec témoignage d\'un ancien participant',
        hashtags: '#j3 #workshop',
      },
      {
        id: '5',
        date: getDateOffset(workshop.date, 1),
        content: `🔥 DEMAIN c'est l'atelier ${workshop.name} !\n\nDernière chance de vous inscrire.\n\nOn a hâte de vous retrouver ! 🚀`,
        visualDescription: 'Visuel urgence J-1, couleurs vives',
        hashtags: '#demain #workshop',
      },
    ])

    // Emails
    setEmails([
      {
        id: '1',
        timing: 'J-7 (7 jours avant)',
        subject: `[Rappel] ${workshop.name} - Plus qu'une semaine !`,
        body: `Bonjour {{prénom}},\n\nDans exactement 7 jours, nous nous retrouvons pour l'atelier "${workshop.name}".\n\n📅 Date: ${workshop.date}\n🕐 Heure: ${workshop.time}\n📍 Lieu: ${workshop.location}\n⏱ Durée: ${workshop.duration}\n\nCe que nous allons voir ensemble:\n${workshop.benefits}\n\nPour préparer au mieux cette session, je vous invite à:\n1. Bloquer votre agenda\n2. Préparer vos questions\n3. Télécharger le programme complet en pièce jointe\n\nÀ très vite !\n\nSSD Communication`,
      },
      {
        id: '2',
        timing: 'J-3 (3 jours avant)',
        subject: `Plus que 3 jours avant ${workshop.name} 🎯`,
        body: `Bonjour {{prénom}},\n\nPlus que 3 jours avant notre atelier !\n\nJ'ai hâte de vous retrouver pour cette session ${workshop.format.toLowerCase()}.\n\nPour rappel:\n📅 ${workshop.date} à ${workshop.time}\n📍 ${workshop.location}\n\n💡 Astuce: Pensez à préparer un carnet et un stylo pour prendre des notes.\n\nEn cas d'imprévu, répondez simplement à ce mail.\n\nÀ bientôt !\n\nSSD Communication`,
      },
      {
        id: '3',
        timing: 'J-1 (la veille)',
        subject: `Demain c'est le grand jour ! ${workshop.name}`,
        body: `Bonjour {{prénom}},\n\nDemain nous nous retrouvons pour l'atelier "${workshop.name}" !\n\n📅 Demain à ${workshop.time}\n📍 ${workshop.location}\n\nCheck-list pour demain:\n☑ Confirmer votre présence (répondez OK)\n☑ Vérifier le lieu et itinéraire\n☑ Apporter de quoi noter\n☑ Charger votre téléphone\n\nEn cas d'empêchement, prévenez-moi dès que possible.\n\nÀ demain !\n\nSSD Communication`,
      },
      {
        id: '4',
        timing: 'H-1 (1 heure avant)',
        subject: `On démarre dans 1h ! 🚀`,
        body: `Bonjour {{prénom}},\n\nRappel: notre atelier "${workshop.name}" démarre dans 1 heure !\n\n🕐 Début: ${workshop.time}\n📍 ${workshop.location}\n\n${workshop.format === 'Visio' ? '🔗 Lien de connexion: [LIEN_VISIO]\n\n💡 Testez votre son/vidéo dès maintenant.' : '🚗 Prévoyez 15 min pour l\'installation et le café d\'accueil.'}\n\nÀ tout de suite !\n\nSSD Communication`,
      },
    ])

    // Prospection
    setProspection([
      { id: '1', channel: 'LinkedIn', target: `Décideurs ${workshop.audience}`, action: 'Message de connexion personnalisé', timing: 'J-21 à J-14' },
      { id: '2', channel: 'LinkedIn', target: 'Contacts de 2e degré', action: 'Invitation à voir le post de lancement', timing: 'J-14' },
      { id: '3', channel: 'Email', target: 'Base de données existante', action: `Email d'invitation ${workshop.name}`, timing: 'J-14' },
      { id: '4', channel: 'LinkedIn', target: 'Nouveaux contacts', action: 'Follow-up après connexion + partage de valeur', timing: 'J-10' },
      { id: '5', channel: 'Téléphone', target: 'Prospects chauds', action: 'Appel de qualification et invitation', timing: 'J-7' },
      { id: '6', channel: 'Email', target: 'Non-répondants', action: 'Relance personnalisée avec bonus', timing: 'J-5' },
      { id: '7', channel: 'LinkedIn', target: 'Ambassadeurs', action: 'Demander partages du post', timing: 'J-3' },
    ])

    // Landing page
    setLandingPage({
      headline: `${workshop.name}`,
      subheadline: workshop.description,
      hero: `Rejoignez-nous le ${workshop.date} pour un atelier ${workshop.format.toLowerCase()} unique conçu pour ${workshop.audience}`,
      benefits: workshop.benefits.split('\n').filter(b => b.trim()),
      testimonials: 'Ajoutez ici 2-3 témoignages de participants précédents',
      cta: `Je réserve ma place - ${workshop.price}€`,
      faq: [
        'Combien de places disponibles ?',
        'Puis-je annuler ma participation ?',
        'Un support sera-t-il fourni ?',
      ],
    })

    setGenerated(true)
    setActiveTab('tasks')
  }

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id))
  const addTask = () => setTasks([...tasks, { id: Date.now().toString(), title: 'Nouvelle tâche', category: 'Autre', dueDate: workshop.date, status: 'todo', priority: 'medium' }])

  const updatePost = (id: string, field: keyof LinkedInPost, value: string) => {
    setLinkedinPosts(linkedinPosts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const deletePost = (id: string) => setLinkedinPosts(linkedinPosts.filter(p => p.id !== id))
  const addPost = () => setLinkedinPosts([...linkedinPosts, { id: Date.now().toString(), date: workshop.date, content: '', visualDescription: '', hashtags: '' }])

  const updateEmail = (id: string, field: keyof Email, value: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const updateProspection = (id: string, field: keyof ProspectionAction, value: string) => {
    setProspection(prospection.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const deleteProspection = (id: string) => setProspection(prospection.filter(p => p.id !== id))
  const addProspection = () => setProspection([...prospection, { id: Date.now().toString(), channel: 'LinkedIn', target: '', action: '', timing: '' }])

  const priorityColor = (p: string) => p === 'high' ? 'bg-red-100 text-red-700' : p === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'

  const tabs = [
    { id: 'input', label: '📝 Infos Atelier', enabled: true },
    { id: 'tasks', label: `✅ Tâches (${tasks.length})`, enabled: generated },
    { id: 'linkedin', label: `📱 LinkedIn (${linkedinPosts.length})`, enabled: generated },
    { id: 'emails', label: `✉ Emails (${emails.length})`, enabled: generated },
    { id: 'prospection', label: `🤝 Prospection (${prospection.length})`, enabled: generated },
    { id: 'landing', label: '🌐 Landing Page', enabled: generated },
  ] as const

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">🎯 Assistant Atelier</h1>
        <p className="text-gray-600 mt-2">Renseignez les informations de votre atelier et générez automatiquement tout le nécessaire pour son lancement.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
            disabled={!tab.enabled}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-[#4dd1e3] text-[#4dd1e3]'
                : tab.enabled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'input' && (
        <Card title="Informations de l'atelier">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'atelier *</label>
              <input type="text" value={workshop.name} onChange={e => setWorkshop({ ...workshop, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Ex: Découvrez votre IKIGAI" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={workshop.date} onChange={e => setWorkshop({ ...workshop, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input type="time" value={workshop.time} onChange={e => setWorkshop({ ...workshop, time: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input type="number" value={workshop.price} onChange={e => setWorkshop({ ...workshop, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="49" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <input type="text" value={workshop.duration} onChange={e => setWorkshop({ ...workshop, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Ex: 3 heures" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select value={workshop.format} onChange={e => setWorkshop({ ...workshop, format: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded">
                <option>Présentiel</option>
                <option>Visio</option>
                <option>Hybride</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu / Plateforme</label>
              <input type="text" value={workshop.location} onChange={e => setWorkshop({ ...workshop, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Ex: Zoom, Paris, ..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Public cible</label>
              <input type="text" value={workshop.audience} onChange={e => setWorkshop({ ...workshop, audience: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Ex: Freelances en reconversion, dirigeants de PME" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={workshop.description} onChange={e => setWorkshop({ ...workshop, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Décrivez l'atelier en 2-3 lignes" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bénéfices (un par ligne)</label>
              <textarea value={workshop.benefits} onChange={e => setWorkshop({ ...workshop, benefits: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder={'✅ Bénéfice 1\n✅ Bénéfice 2\n✅ Bénéfice 3'} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={generateAll} className="px-6 py-3 bg-[#4dd1e3] text-white rounded-md font-semibold hover:bg-[#3bb8c9] transition-colors shadow-md">
              🚀 Générer toutes les ressources
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'tasks' && generated && (
        <Card title="✅ Tâches générées">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">{tasks.filter(t => t.status === 'done').length}/{tasks.length} complétées</p>
            <button onClick={addTask} className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm">
              + Ajouter une tâche
            </button>
          </div>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className={`p-4 border rounded-lg ${task.status === 'done' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={task.status === 'done'} onChange={e => updateTask(task.id, 'status', e.target.checked ? 'done' : 'todo')} className="mt-1" />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                    <input type="text" value={task.title} onChange={e => updateTask(task.id, 'title', e.target.value)} className="md:col-span-5 px-2 py-1 border border-gray-200 rounded text-sm" />
                    <input type="text" value={task.category} onChange={e => updateTask(task.id, 'category', e.target.value)} className="md:col-span-2 px-2 py-1 border border-gray-200 rounded text-sm" />
                    <input type="date" value={task.dueDate} onChange={e => updateTask(task.id, 'dueDate', e.target.value)} className="md:col-span-2 px-2 py-1 border border-gray-200 rounded text-sm" />
                    <select value={task.priority} onChange={e => updateTask(task.id, 'priority', e.target.value)} className={`md:col-span-2 px-2 py-1 border border-gray-200 rounded text-sm ${priorityColor(task.priority)}`}>
                      <option value="high">🔴 Haute</option>
                      <option value="medium">🟡 Moyenne</option>
                      <option value="low">⚪ Basse</option>
                    </select>
                    <button onClick={() => deleteTask(task.id)} className="md:col-span-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'linkedin' && generated && (
        <Card title="📱 Publications LinkedIn programmées">
          <div className="mb-4 flex justify-end">
            <button onClick={addPost} className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm">
              + Ajouter un post
            </button>
          </div>
          <div className="space-y-4">
            {linkedinPosts.map(post => (
              <div key={post.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-start mb-3">
                  <input type="date" value={post.date} onChange={e => updatePost(post.id, 'date', e.target.value)} className="px-2 py-1 border border-gray-200 rounded text-sm font-semibold text-blue-600" />
                  <button onClick={() => deletePost(post.id)} className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm">🗑 Supprimer</button>
                </div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contenu du post</label>
                <textarea value={post.content} onChange={e => updatePost(post.id, 'content', e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-3" />
                <label className="block text-xs font-medium text-gray-500 mb-1">🎨 Description du visuel</label>
                <input type="text" value={post.visualDescription} onChange={e => updatePost(post.id, 'visualDescription', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-3" />
                <label className="block text-xs font-medium text-gray-500 mb-1"># Hashtags</label>
                <input type="text" value={post.hashtags} onChange={e => updatePost(post.id, 'hashtags', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-blue-600" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'emails' && generated && (
        <Card title="✉ Séquence emails">
          <div className="space-y-4">
            {emails.map(email => (
              <div key={email.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {email.timing}
                  </span>
                </div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Objet</label>
                <input type="text" value={email.subject} onChange={e => updateEmail(email.id, 'subject', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-3 font-semibold" />
                <label className="block text-xs font-medium text-gray-500 mb-1">Corps du message</label>
                <textarea value={email.body} onChange={e => updateEmail(email.id, 'body', e.target.value)} rows={12} className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'prospection' && generated && (
        <Card title="🤝 Plan de prospection">
          <div className="mb-4 flex justify-end">
            <button onClick={addProspection} className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm">
              + Ajouter une action
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold">Canal</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold">Cible</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold">Action</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold">Timing</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospection.map(p => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">
                      <select value={p.channel} onChange={e => updateProspection(p.id, 'channel', e.target.value)} className="px-2 py-1 border border-gray-200 rounded text-sm">
                        <option>LinkedIn</option>
                        <option>Email</option>
                        <option>Téléphone</option>
                        <option>Whatsapp</option>
                        <option>SMS</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input type="text" value={p.target} onChange={e => updateProspection(p.id, 'target', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="text" value={p.action} onChange={e => updateProspection(p.id, 'action', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="text" value={p.timing} onChange={e => updateProspection(p.id, 'timing', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                    </td>
                    <td className="py-2 px-3">
                      <button onClick={() => deleteProspection(p.id)} className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'landing' && generated && (
        <Card title="🌐 Landing Page proposée">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre principal (Headline)</label>
              <input type="text" value={landingPage.headline} onChange={e => setLandingPage({ ...landingPage, headline: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-2xl font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
              <input type="text" value={landingPage.subheadline} onChange={e => setLandingPage({ ...landingPage, subheadline: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Hero</label>
              <textarea value={landingPage.hero} onChange={e => setLandingPage({ ...landingPage, hero: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bénéfices</label>
              <textarea value={landingPage.benefits.join('\n')} onChange={e => setLandingPage({ ...landingPage, benefits: e.target.value.split('\n') })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Témoignages</label>
              <textarea value={landingPage.testimonials} onChange={e => setLandingPage({ ...landingPage, testimonials: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA (bouton d'action)</label>
              <input type="text" value={landingPage.cta} onChange={e => setLandingPage({ ...landingPage, cta: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded font-semibold text-[#4dd1e3]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FAQ (une question par ligne)</label>
              <textarea value={landingPage.faq.join('\n')} onChange={e => setLandingPage({ ...landingPage, faq: e.target.value.split('\n') })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-[#4dd1e3]/10 to-purple-100 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">📱 Aperçu</p>
              <h2 className="text-3xl font-bold text-gray-900">{landingPage.headline}</h2>
              <p className="text-lg text-gray-700 mt-2">{landingPage.subheadline}</p>
              <p className="text-gray-600 mt-3">{landingPage.hero}</p>
              <ul className="mt-4 space-y-1">
                {landingPage.benefits.map((b, i) => (
                  <li key={i} className="text-sm">✅ {b}</li>
                ))}
              </ul>
              <button className="mt-4 px-6 py-3 bg-[#4dd1e3] text-white rounded-md font-semibold hover:bg-[#3bb8c9]">
                {landingPage.cta}
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
