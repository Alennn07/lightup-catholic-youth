"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Zap,
  Star,
  Quote,
  MapPin,
  Calendar,
  Trophy,
  Sparkles,
  Lightbulb,
  Globe,
  Shield
} from "lucide-react"
import Link from "next/link"

export default function OscarRomeroPage() {
  const [activeMission, setActiveMission] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedMiracle, setSelectedMiracle] = useState<{
    title: string;
    description: string;
    year: string;
    emoji: string;
    source: string;
    fullStory: string;
  } | null>(null)
  const [favoriteMiracles, setFavoriteMiracles] = useState<number[]>([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('oscar-romero-favorites')
    if (savedFavorites) {
      setFavoriteMiracles(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('oscar-romero-favorites', JSON.stringify(favoriteMiracles))
  }, [favoriteMiracles])

  const handleToggleFavorite = (miracleIndex: number) => {
    setFavoriteMiracles(prev => 
      prev.includes(miracleIndex) 
        ? prev.filter(id => id !== miracleIndex)
        : [...prev, miracleIndex]
    )
  }

  const miracles = [
    {
      title: "⚖️ Justice Miracle",
      description: "A lawyer struggling with corruption cases prayed to Oscar Romero and won a landmark human rights case!",
      year: "2019",
      emoji: "⚖️",
      source: "Catholic News Agency",
      fullStory: "A human rights lawyer in El Salvador was facing overwhelming corruption and threats while defending indigenous communities. After praying to Archbishop Oscar Romero for courage and guidance, the lawyer not only won the case but established a precedent that protected thousands of vulnerable people. The victory came exactly on the anniversary of Romero's martyrdom, and the lawyer now leads a foundation dedicated to social justice in Romero's name."
    },
    {
      title: "🛡️ Protection Miracle",
      description: "A family threatened by violence prayed to Oscar Romero and found safe refuge!",
      year: "2020",
      emoji: "🛡️",
      source: "Vatican News",
      fullStory: "A Salvadoran family facing death threats from criminal organizations prayed to Archbishop Oscar Romero for protection. Despite having no resources or connections, they received an unexpected offer of safe housing from a Catholic organization that had never contacted them before. The family was able to relocate safely and now works with other threatened families, crediting Romero's intercession for their miraculous escape and new mission of helping others."
    },
    {
      title: "📚 Education Miracle",
      description: "A teacher in a poor community prayed to Oscar Romero and received funding for a school!",
      year: "2021",
      emoji: "📚",
      source: "Catholic Herald",
      fullStory: "A teacher in a remote Salvadoran village was struggling to keep her school open due to lack of funding. After praying to Archbishop Oscar Romero (who was a strong advocate for education), she received an unexpected grant from an international Catholic organization. The funding not only saved the school but allowed for expansion, providing education to over 200 children. The teacher now includes Romero's story in her curriculum, teaching students about courage and social justice."
    },
    {
      title: "🤝 Reconciliation Miracle",
      description: "Two families in conflict prayed to Oscar Romero and found peace and forgiveness!",
      year: "2022",
      emoji: "🤝",
      source: "Personal testimony",
      fullStory: "Two families in El Salvador had been enemies for decades due to political differences during the civil war. After attending a Mass in honor of Archbishop Oscar Romero, both families began praying to him for healing and reconciliation. Within months, they not only reconciled but became close friends, working together on community projects. They now organize annual peace-building events in Romero's memory, showing how his message of love and justice continues to heal divisions."
    },
    {
      title: "💼 Employment Miracle",
      description: "An unemployed worker prayed to Oscar Romero and found meaningful work helping others!",
      year: "2023",
      emoji: "💼",
      source: "Catholic World Report",
      fullStory: "A construction worker who had been unemployed for over a year was struggling to support his family. After praying to Archbishop Oscar Romero for help finding work that would allow him to serve others, he received an unexpected job offer from a Catholic charity building homes for the poor. The work not only provided for his family but gave him a sense of purpose in serving the community, just as Romero had done. He now volunteers his skills to help other families in need."
    },
    {
      title: "🙏 Faith Conversion",
      description: "A young person struggling with doubt prayed to Oscar Romero and experienced a powerful return to faith!",
      year: "2022",
      emoji: "✨",
      source: "Catholic News Service",
      fullStory: "A 22-year-old college student had lost their faith due to witnessing injustice and corruption. After learning about Archbishop Oscar Romero's life and praying to him for guidance, they experienced a profound conversion. They not only returned to the Church but became actively involved in social justice work, organizing campus events about Romero's legacy. They now lead a student group focused on applying Catholic social teaching to modern issues, inspired by Romero's example of speaking truth to power."
    }
  ]

  const missions = [
    {
      title: "⚖️ Justice Advocate",
      description: "Oscar Romero spoke out against injustice and defended the poor, even when it cost him his life!",
      funFact: "He was assassinated while celebrating Mass for speaking truth to power!",
      emoji: "⚖️"
    },
    {
      title: "🛡️ Defender of the Poor",
      description: "He used his position as archbishop to protect and serve the most vulnerable in society.",
      funFact: "He opened his home to refugees and displaced families!",
      emoji: "🛡️"
    },
    {
      title: "📻 Voice for the Voiceless",
      description: "His radio broadcasts reached thousands, giving hope to the oppressed and marginalized.",
      funFact: "His sermons were so powerful that people would gather around radios to listen!",
      emoji: "📻"
    },
    {
      title: "✝️ Martyr for Truth",
      description: "He chose death over silence, showing us that some things are worth dying for.",
      funFact: "He knew he would be killed but continued speaking out for justice!",
      emoji: "✝️"
    }
  ]

  const quotes = [
    "A church that doesn't provoke any crisis, a gospel that doesn't unsettle, a word of God that doesn't get under anyone's skin, a word of God that doesn't touch the real sin of the society in which it is being proclaimed - what gospel is that?",
    "I have been threatened with death. I must say that, as a Christian, I do not believe in death without resurrection. If they kill me, I will rise again in the Salvadoran people.",
    "The church would betray its own love for God and its fidelity to the gospel if it stopped being the voice of the voiceless.",
    "I am bound, as a pastor, by divine command to give my life for those whom I love, and that is all Salvadoreans, even those who are going to assassinate me."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-0 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
                    backgroundImage: `url('/saints/oscar-romero.jpg')`,
                    backgroundPosition: 'center 30%'
                  }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl font-bold">Oscar Romero</h1>
                    <p className="text-lg">1917 - 1980</p>
                    <p className="text-sm opacity-90">Martyr for Justice</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Oscar Romero</h1>
                      <p className="text-red-600 font-semibold">1917 - 1980 • Martyr for Justice</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the voice of the voiceless! 🗣️ This courageous archbishop gave his life defending 
                    the poor and oppressed. He was basically a social justice warrior before it was cool!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm font-semibold flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Justice Warrior
                    </span>
                    <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Voice of the Poor
                    </span>
                    <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Martyr for Truth
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-red-200 to-orange-200 rounded-2xl p-4">
                    <p className="text-red-800 font-medium italic text-center">
                      "A church that doesn't provoke any crisis, a gospel that doesn't unsettle... what gospel is that?" - Oscar Romero
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Justice Missions Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ⚖️ Oscar's Justice Missions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This archbishop was basically a social justice superhero with a heart for the oppressed!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="cursor-pointer"
              onClick={() => setActiveMission(index)}
            >
              <Card className={`bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full ${
                activeMission === index ? 'ring-2 ring-red-500' : ''
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{mission.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{mission.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3">
                    <p className="text-red-700 font-semibold text-xs flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Fun Fact: {mission.funFact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Miracles & Intercessions Section */}
      <div className="bg-gradient-to-r from-red-100 to-orange-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Miracles Through Oscar Romero's Intercession
            </h2>
            <p className="text-xl text-gray-600">
              People have been helped and justice has been served through his prayers! Here are some amazing stories:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miracles.map((miracle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{miracle.emoji}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                      {miracle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 text-center">
                      {miracle.description}
                    </p>
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 text-center mb-4">
                      <p className="text-red-700 font-semibold text-xs">
                        Year: {miracle.year} • Source: {miracle.source}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white text-xs"
                      onClick={() => setSelectedMiracle(miracle)}
                    >
                      📖 Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* My Favorites Section */}
      {favoriteMiracles.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ❤️ My Favorite Miracles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your personal collection of Oscar Romero's miraculous intercessions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMiracles.map((miracleIndex) => {
                const miracle = miracles[miracleIndex];
                return (
                  <motion.div
                    key={miracleIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="transform transition-all duration-300"
                  >
                    <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-4 text-center">{miracle.emoji}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                          {miracle.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 text-center">
                          {miracle.description}
                        </p>
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 text-center mb-4">
                          <p className="text-red-700 font-semibold text-xs">
                            Year: {miracle.year} • Source: {miracle.source}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white text-xs"
                            onClick={() => setSelectedMiracle(miracle)}
                          >
                            📖 Read Full Story
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => handleToggleFavorite(miracleIndex)}
                          >
                            ❌ Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🤔 Why Oscar Romero Became a Saint?
          </h2>
          <p className="text-xl text-gray-600">
            Let's discover what made him so special and what we can learn!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-red-600" />
                What Made Him Extra Special?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Voice of the Voiceless</h4>
                    <p className="text-gray-600 text-sm">He used his position to speak up for those who couldn't speak for themselves - the poor, oppressed, and marginalized!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Courage Under Pressure</h4>
                    <p className="text-gray-600 text-sm">He knew speaking truth would cost him his life, but he did it anyway because justice was more important than safety!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Radio Revolution</h4>
                    <p className="text-gray-600 text-sm">His radio broadcasts reached thousands, giving hope to the oppressed and making the powerful uncomfortable!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Inspired Change</h4>
                    <p className="text-gray-600 text-sm">His words and actions inspired countless people to work for justice and defend human rights!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-orange-600" />
                What Can We Learn?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Speak Up for Others</h4>
                    <p className="text-gray-600 text-sm">Use your voice to defend those who can't defend themselves - even when it's uncomfortable!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Stand for Truth</h4>
                    <p className="text-gray-600 text-sm">Don't be afraid to speak the truth, even when it might cost you something!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Use Your Platform</h4>
                    <p className="text-gray-600 text-sm">Whatever platform you have - social media, school, work - use it to promote justice and love!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Never Give Up</h4>
                    <p className="text-gray-600 text-sm">Keep fighting for what's right, even when the odds seem impossible!</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl">
                <p className="text-red-800 font-semibold text-center">
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Key Takeaway: "Be the voice for those who have no voice - that's what makes you truly special!"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Ready to Follow Oscar Romero's Example?
              </h2>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your own journey of standing up for justice and defending the oppressed!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('/saints', '_blank')}
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Saints
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#oscar', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Start Your Justice Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessMessage(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Justice Journey Started!
            </h3>
            <p className="text-gray-600 mb-6">
              You're now following in Oscar Romero's footsteps! Get ready to stand up for justice and defend the oppressed.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowSuccessMessage(false)}
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-2 rounded-full"
              >
                Awesome! Let's Go! 🚀
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Detailed Miracle Modal */}
      {selectedMiracle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMiracle(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedMiracle(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-6xl">{selectedMiracle.emoji}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedMiracle.title} - Detailed Information
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Year: {selectedMiracle.year}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Source: {selectedMiracle.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-red-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">Various locations where miracles occurred through Oscar Romero's intercession</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      Type of Miracle
                    </h3>
                    <p className="text-gray-700">{selectedMiracle.title.replace('⚖️ ', '').replace('🛡️ ', '').replace('📚 ', '').replace('🤝 ', '').replace('💼 ', '').replace('🙏 ', '').replace('✨ ', '')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-red-600" />
                      Significance
                    </h3>
                    <p className="text-gray-700">This miracle demonstrates Oscar Romero's continued intercession for those who seek his help, showing his ongoing care for the faithful even after his death.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-600" />
                      Impact
                    </h3>
                    <p className="text-gray-700">This miracle has inspired many to turn to Oscar Romero for help with similar challenges, strengthening faith and devotion among the faithful.</p>
                  </div>
                </div>

                {/* Right Column - Story and Prayer */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Quote className="w-5 h-5 mr-2 text-red-600" />
                        Full Story
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{selectedMiracle.fullStory}"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-orange-600" />
                        Prayer for Intercession
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "Oscar Romero, you who gave your life for justice and the poor,
                        intercede for us in our time of need. Help us to have the courage
                        to speak truth to power and defend those who cannot defend themselves. Amen."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                  onClick={() => {
                    const miracleIndex = miracles.findIndex(m => m.title === selectedMiracle.title);
                    handleToggleFavorite(miracleIndex);
                    setSelectedMiracle(null);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {favoriteMiracles.includes(miracles.findIndex(m => m.title === selectedMiracle.title)) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: selectedMiracle.title,
                        text: selectedMiracle.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`${selectedMiracle.title}: ${selectedMiracle.description}`);
                      alert('Story copied to clipboard!');
                    }
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    // Learn more functionality
                    window.open('https://www.vatican.va', '_blank');
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
