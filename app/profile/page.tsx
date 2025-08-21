"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, MapPin, Building, ArrowLeft, Save, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // Fallback toast function in case useToast fails
  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    try {
      if (toast) {
        toast({ title, description, variant })
      } else {
        // Fallback to alert if toast is not available
        alert(`${title}: ${description}`)
      }
    } catch (error) {
      console.error('Toast error:', error)
      alert(`${title}: ${description}`)
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    age: 0,
    parish: "",
    diocese: ""
  })

  useEffect(() => {
    if (user) {
      console.log('Profile: User data updated:', user)
      setFormData({
        name: user.name || "",
        username: user.username || `user_${user.id?.slice(0, 8)}` || "",
        age: user.age || 0,
        parish: user.parish || "",
        diocese: user.diocese || ""
      })
    }
  }, [user])

  const handleSave = useCallback(async () => {
    try {
      if (!user) {
        alert('No user found!')
        return
      }
      
      if (!updateProfile) {
        alert('No updateProfile function!')
        return
      }
      
      // Validate form data
      if (!formData.name.trim()) {
        alert('Name is required!')
        return
      }
      
      if (!formData.username.trim()) {
        alert('Username is required!')
        return
      }
      
      // Check if username contains only valid characters
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        alert('Username can only contain letters, numbers, and underscores!')
        return
      }
      
      // Update profile with all data
      await updateProfile(formData)
      
      alert('Profile updated successfully!')
      setIsEditing(false)
      
      // Refresh the page to show updated data
      window.location.reload()
      
    } catch (error) {
      console.error('❌ Error in handleSave:', error)
      alert('Error: ' + error.message)
    }
  }, [formData, updateProfile, user])

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        age: user.age || 0,
        parish: user.parish || "",
        diocese: user.diocese || ""
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid gap-6">
            {/* Profile Header Skeleton */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </CardHeader>
            </Card>

            {/* Profile Details Skeleton */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/sign-in")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <Navigation />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Welcome Banner for New Users */}
          {!user.name && !user.username && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Welcome to LightUp! ✨</h3>
                    <p className="text-blue-700 text-sm">Set your preferred name and username to personalize your faith journey experience.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Header */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {user.username ? (
                  <div className="space-y-2">
                    <div>@{user.username}</div>
                    {user.name && <div className="text-lg text-gray-600 font-normal">{user.name}</div>}
                  </div>
                ) : (
                  user.name || 'Set Your Preferred Name'
                )}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {user.username ? 'Your Faith Journey Profile' : 
                 user.name ? 'Your Faith Journey Profile' : 
                 'Click Edit to set your name and personalize your experience'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Profile Information</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your personal information and preferences. Click on any field to edit it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Preferred Name
                    <Edit className="h-3 w-3 text-gray-400" />
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your preferred name"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.name || (
                        <span className="text-gray-500 italic">Click to set your preferred name</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-blue-600 font-bold">@</span>
                    Username
                    <Edit className="h-3 w-3 text-gray-400" />
                  </Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.username ? (
                        <span className="text-blue-600 font-medium">@{user.username}</span>
                      ) : (
                        <span className="text-gray-500 italic">Click to set your username</span>
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500">Username will be displayed as @username throughout the app</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Age
                    <Edit className="h-3 w-3 text-gray-400" />
                  </Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.age || (
                        <span className="text-gray-500 italic">Click to set your age</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parish" className="text-gray-700 font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Parish
                    <Edit className="h-3 w-3 text-gray-400" />
                  </Label>
                  {isEditing ? (
                    <Input
                      id="parish"
                      value={formData.parish}
                      onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.parish || (
                        <span className="text-gray-500 italic">Click to set your parish</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="diocese" className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Diocese
                    <Edit className="h-3 w-3 text-gray-400" />
                  </Label>
                  {isEditing ? (
                    <Input
                      id="diocese"
                      value={formData.diocese}
                      onChange={(e) => setFormData({ ...formData, diocese: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <div 
                      className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.diocese || (
                        <span className="text-gray-500 italic">Click to set your diocese</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSave} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white font-medium"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
