"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, MapPin, ArrowLeft, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GroupRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "Group registered!",
        description: "Your group has been successfully registered. You can now sign in.",
        variant: "default",
      })

      // Redirect to sign in page
      router.push("/auth/sign-in?tab=group")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error registering your group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-12 px-4">
      <Link
        href="/auth/sign-in"
        className="absolute top-4 left-4 flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Sign In</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-purple-500 fill-purple-200" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              LightUp
            </h1>
          </div>
        </div>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Register Your Youth Group
            </CardTitle>
            <CardDescription className="text-center">
              Join our network of Catholic youth groups and gain access to shared calendars and resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-800">Group Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input id="group-name" placeholder="St. Mary's Youth Ministry" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parish">Parish Name</Label>
                    <Input id="parish" placeholder="St. Mary's Catholic Church" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                    <Input id="address" placeholder="123 Faith Street" className="pl-10" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Ahmedabad" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="Gujarat" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="380001" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age-range">Age Range</Label>
                    <Select defaultValue="14-18">
                      <SelectTrigger id="age-range">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="13-17">13-17 years</SelectItem>
                        <SelectItem value="14-18">14-18 years</SelectItem>
                        <SelectItem value="18-22">18-22 years</SelectItem>
                        <SelectItem value="18-25">18-25 years</SelectItem>
                        <SelectItem value="25-35">25-35 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-type">Group Type</Label>
                    <Select defaultValue="prayer">
                      <SelectTrigger id="group-type">
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prayer">Prayer Group</SelectItem>
                        <SelectItem value="bible-study">Bible Study</SelectItem>
                        <SelectItem value="service">Service Group</SelectItem>
                        <SelectItem value="social">Social Group</SelectItem>
                        <SelectItem value="mixed">Mixed Activities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Group Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your group, its mission, and activities..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-800">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" placeholder="Fr. Thomas" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="leader">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leader">Group Leader</SelectItem>
                        <SelectItem value="coordinator">Youth Coordinator</SelectItem>
                        <SelectItem value="priest">Parish Priest</SelectItem>
                        <SelectItem value="sister">Religious Sister</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                      <Input id="email" type="email" placeholder="contact@example.com" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                      <Input id="phone" placeholder="+91 98765 43210" className="pl-10" required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-800">Account Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-id">Group ID (for login)</Label>
                    <Input id="group-id" placeholder="Choose a unique group ID" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-password">Password</Label>
                    <Input id="group-password" type="password" placeholder="••••••••" required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="verification" required />
                  <label
                    htmlFor="verification"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that I am authorized to register this youth group
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-800">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-800">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register Group"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Link href="/auth/sign-in?tab=group" className="text-purple-600 hover:text-purple-800 font-medium">
                Sign in as a group
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
