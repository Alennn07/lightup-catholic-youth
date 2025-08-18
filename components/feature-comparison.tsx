"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Star, Users, Download, Heart } from "lucide-react"

const apps = [
  {
    id: "lightup",
    name: "LightUp",
    description: "Modern Catholic youth platform",
    logo: "💡",
    rating: 4.9,
    users: "50K+",
    price: "Free",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "laudate",
    name: "Laudate",
    description: "Traditional Catholic app",
    logo: "📿",
    rating: 4.6,
    users: "1M+",
    price: "Free",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "hallow",
    name: "Hallow",
    description: "Catholic prayer & meditation",
    logo: "🙏",
    rating: 4.8,
    users: "500K+",
    price: "$8.99/mo",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "ibreviary",
    name: "iBreviary",
    description: "Digital breviary",
    logo: "📖",
    rating: 4.5,
    users: "200K+",
    price: "Free",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "catholic-bible",
    name: "Catholic Bible",
    description: "Bible reading app",
    logo: "✝️",
    rating: 4.4,
    users: "300K+",
    price: "Free",
    color: "from-indigo-500 to-blue-500",
  },
]

const featureCategories = [
  {
    name: "Community Features",
    features: [
      { name: "Prayer Wall", lightup: true, laudate: false, hallow: false, ibreviary: false, catholicBible: false },
      { name: "Youth Groups", lightup: true, laudate: false, hallow: false, ibreviary: false, catholicBible: false },
      { name: "Social Sharing", lightup: true, laudate: true, hallow: true, ibreviary: false, catholicBible: true },
      { name: "Community Chat", lightup: true, laudate: false, hallow: false, ibreviary: false, catholicBible: false },
    ],
  },
  {
    name: "Spiritual Growth",
    features: [
      { name: "Daily Bible Verse", lightup: true, laudate: true, hallow: true, ibreviary: true, catholicBible: true },
      { name: "Faith Journal", lightup: true, laudate: false, hallow: true, ibreviary: false, catholicBible: false },
      { name: "Prayer Tracking", lightup: true, laudate: false, hallow: true, ibreviary: true, catholicBible: false },
      {
        name: "Spiritual Challenges",
        lightup: true,
        laudate: false,
        hallow: true,
        ibreviary: false,
        catholicBible: false,
      },
    ],
  },
  {
    name: "Guidance & Support",
    features: [
      { name: "AI Assistant", lightup: true, laudate: false, hallow: false, ibreviary: false, catholicBible: false },
      { name: "Confession Guide", lightup: true, laudate: true, hallow: true, ibreviary: false, catholicBible: false },
      { name: "Saint Stories", lightup: true, laudate: true, hallow: true, ibreviary: true, catholicBible: false },
      {
        name: "Spiritual Direction",
        lightup: false,
        laudate: false,
        hallow: true,
        ibreviary: false,
        catholicBible: false,
      },
    ],
  },
  {
    name: "Liturgical & Worship",
    features: [
      { name: "Mass Times", lightup: true, laudate: true, hallow: false, ibreviary: false, catholicBible: false },
      {
        name: "Liturgical Calendar",
        lightup: true,
        laudate: true,
        hallow: true,
        ibreviary: true,
        catholicBible: false,
      },
      { name: "Worship Songs", lightup: true, laudate: true, hallow: true, ibreviary: false, catholicBible: false },
      { name: "Divine Office", lightup: false, laudate: true, hallow: true, ibreviary: true, catholicBible: false },
    ],
  },
  {
    name: "Technical Features",
    features: [
      { name: "Offline Access", lightup: true, laudate: true, hallow: true, ibreviary: true, catholicBible: true },
      { name: "Dark Mode", lightup: true, laudate: false, hallow: true, ibreviary: true, catholicBible: true },
      { name: "Multi-language", lightup: false, laudate: true, hallow: true, ibreviary: true, catholicBible: true },
      {
        name: "Sync Across Devices",
        lightup: true,
        laudate: false,
        hallow: true,
        ibreviary: false,
        catholicBible: true,
      },
    ],
  },
]

export function FeatureComparison() {
  const [selectedApps, setSelectedApps] = useState(["lightup", "laudate", "hallow"])
  const [comparisonView, setComparisonView] = useState("overview")

  const toggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      if (selectedApps.length > 1) {
        setSelectedApps(selectedApps.filter((id) => id !== appId))
      }
    } else {
      if (selectedApps.length < 3) {
        setSelectedApps([...selectedApps, appId])
      }
    }
  }

  const selectedAppData = apps.filter((app) => selectedApps.includes(app.id))

  return (
    <div className="space-y-8">
      {/* App Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Apps to Compare (up to 3)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedApps.includes(app.id)
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:shadow-lg bg-white/80 backdrop-blur-sm"
              }`}
              onClick={() => toggleApp(app.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{app.logo}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{app.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                    {app.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 text-gray-400 mr-1" />
                    {app.users}
                  </div>
                </div>
                <Badge className={`mt-2 bg-gradient-to-r ${app.color} text-white border-0`}>{app.price}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Comparison Views */}
      <Tabs value={comparisonView} onValueChange={setComparisonView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Quick Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedAppData.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{app.logo}</div>
                    <CardTitle className="text-2xl">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-semibold">{app.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Users</span>
                      <span className="font-semibold">{app.users}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price</span>
                      <Badge className={`bg-gradient-to-r ${app.color} text-white border-0`}>{app.price}</Badge>
                    </div>
                    {app.id === "lightup" && (
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Heart className="h-4 w-4 mr-2" />
                        Try LightUp Free
                      </Button>
                    )}
                    {app.id !== "lightup" && (
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download {app.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto"
          >
            <div className="min-w-full">
              {featureCategories.map((category, categoryIndex) => (
                <Card key={category.name} className="mb-6 bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                            {selectedAppData.map((app) => (
                              <th key={app.id} className="text-center py-3 px-4 font-semibold text-gray-700">
                                <div className="flex flex-col items-center">
                                  <div className="text-2xl mb-1">{app.logo}</div>
                                  <div className="text-sm">{app.name}</div>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {category.features.map((feature, featureIndex) => (
                            <motion.tr
                              key={feature.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: categoryIndex * 0.1 + featureIndex * 0.05 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 font-medium text-gray-800">{feature.name}</td>
                              {selectedAppData.map((app) => (
                                <td key={app.id} className="py-3 px-4 text-center">
                                  {feature[app.id as keyof typeof feature] ? (
                                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-gray-300 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
