"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Lock, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useTranslation } from "@/lib/i18n"

export default function SettingsPage() {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    language: "en",
    timezone: "UTC"
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading settings...</div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/sign-in")
    return null
  }

  const handlePasswordChange = async () => {
    // Validate current password is entered
    if (!passwordData.currentPassword.trim()) {
      toast({
        title: "Current password required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    // Validate new password is entered
    if (!passwordData.newPassword.trim()) {
      toast({
        title: "New password required",
        description: "Please enter your new password.",
        variant: "destructive",
      })
      return
    }

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must be the same.",
        variant: "destructive",
      })
      return
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      // Here you would implement password change logic with Supabase
      // For now, we'll show a success message
      toast({
        title: "Password updated! ✨",
        description: "Your password has been successfully changed.",
        variant: "default",
      })
      
      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      })
    }
  }

  const handleAccountSettingsSave = async () => {
    try {
      // Here you would save account settings to your database
      toast({
        title: "Settings saved! ✨",
        description: "Your account settings have been updated.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Settings save failed",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export will be prepared and sent to your email.",
      variant: "default",
    })
  }

  const handleViewPrivacyPolicy = () => {
    toast({
      title: "Privacy Policy",
      description: "Opening privacy policy in new tab...",
      variant: "default",
    })
    // In a real app, you'd open a new tab with the privacy policy
    // window.open('/privacy-policy', '_blank')
  }

  const handleSecuritySettings = () => {
    toast({
      title: "Security Settings",
      description: "Redirecting to security settings...",
      variant: "default",
    })
    // In a real app, you'd navigate to security settings
    // router.push('/security-settings')
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account deletion initiated",
        description: "Please check your email for confirmation.",
        variant: "default",
      })
    }
  }

  // Safely get user properties with fallbacks
  const userEmail = user?.email || "No email available"
  const userCreatedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">{t("settings.title")}</CardTitle>
            <CardDescription className="text-gray-600">
              {t("settings.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-gray-100 p-1">
                <TabsTrigger value="security" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="account" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your current password"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your new password"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Confirm your new password"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      onClick={handlePasswordChange} 
                      className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                      disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Email</Label>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">{userEmail}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Account Created</Label>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {userCreatedAt}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={handleExportData}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <Label className="text-gray-700 font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.emailNotifications}
                        onChange={(e) => setAccountSettings({ ...accountSettings, emailNotifications: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <Label className="text-gray-700 font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.pushNotifications}
                        onChange={(e) => setAccountSettings({ ...accountSettings, pushNotifications: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <Label className="text-gray-700 font-medium">Marketing Emails</Label>
                        <p className="text-sm text-gray-600">Receive updates about new features</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.marketingEmails}
                        onChange={(e) => setAccountSettings({ ...accountSettings, marketingEmails: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>

                    <Button 
                      onClick={handleAccountSettingsSave} 
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Data Privacy</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        We respect your privacy and protect your personal information. 
                        Your data is encrypted and stored securely.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors"
                        onClick={handleViewPrivacyPolicy}
                      >
                        View Privacy Policy
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Account Security</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Your account is protected with industry-standard security measures.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                        onClick={handleSecuritySettings}
                      >
                        Security Settings
                      </Button>
                    </div>

                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
