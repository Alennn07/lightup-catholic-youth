'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Users, Code, Palette, Megaphone, BookOpen, Camera, Music, Globe, UserCheck, Calendar, UserPlus, Share2, Target, Laptop, Smartphone, Monitor, Image, Video, Edit3, Bug, TrendingUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const volunteerRoles = [
  // Community Roles
  { value: 'prayer-moderator', label: 'Prayer Moderator', icon: UserCheck, description: 'Lead/guide prayer sessions', category: 'Community' },
  { value: 'youth-group-coordinator', label: 'Youth Group Coordinator', icon: Users, description: 'Organize and manage group activities', category: 'Community' },
  { value: 'event-volunteer', label: 'Event Volunteer', icon: Calendar, description: 'Help plan and run LightUp events', category: 'Community' },
  { value: 'mentor-guide', label: 'Mentor / Guide', icon: UserPlus, description: 'Support and encourage younger members', category: 'Community' },
  { value: 'content-sharer', label: 'Content Sharer', icon: Share2, description: 'Share verses, reflections, and uplifting messages', category: 'Community' },
  { value: 'outreach-volunteer', label: 'Outreach Volunteer', icon: Target, description: 'Invite and connect new members to LightUp', category: 'Community' },
  
  // Skill-Based Roles
  { value: 'frontend-developer', label: 'Frontend Developer', icon: Laptop, description: 'Work on UI/UX and fix responsive issues', category: 'Skill-Based' },
  { value: 'backend-developer', label: 'Backend Developer', icon: Code, description: 'Build and improve APIs, Supabase, and integrations', category: 'Skill-Based' },
  { value: 'mobile-developer', label: 'Mobile Developer', icon: Smartphone, description: 'Contribute to future LightUp mobile app', category: 'Skill-Based' },
  { value: 'ui-ux-designer', label: 'UI/UX Designer', icon: Monitor, description: 'Design layouts and improve usability', category: 'Skill-Based' },
  { value: 'graphic-designer', label: 'Graphic Designer', icon: Image, description: 'Create visuals, verse snaps, and posters', category: 'Skill-Based' },
  { value: 'video-editor', label: 'Video Editor', icon: Video, description: 'Edit reels, short films, or promo content', category: 'Skill-Based' },
  { value: 'content-writer-editor', label: 'Content Writer/Editor', icon: Edit3, description: 'Write devotionals, blogs, or app content', category: 'Skill-Based' },
  { value: 'tester-qa-volunteer', label: 'Tester / QA Volunteer', icon: Bug, description: 'Test features and report bugs', category: 'Skill-Based' },
  { value: 'marketing-social-media', label: 'Marketing & Social Media Volunteer', icon: TrendingUp, description: 'Grow LightUp\'s online reach', category: 'Skill-Based' },
  { value: 'community-manager', label: 'Community Manager', icon: MessageSquare, description: 'Manage groups, discussions, and engagement', category: 'Skill-Based' }
];

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    availability: '',
    motivation: '',
    skills: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thank you for your interest! 🙏",
          description: "We'll review your application and get back to you soon.",
        });
        setFormData({
          name: '',
          email: '',
          role: '',
          experience: '',
          availability: '',
          motivation: '',
          skills: '',
          phone: ''
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = volunteerRoles.find(role => role.value === formData.role);
  const IconComponent = selectedRole?.icon || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 font-outfit">
            Join Our Mission
          </CardTitle>
          <p className="text-gray-700 font-nunito-sans text-lg">
            Help us reach more young Catholics around the world
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="bg-white/50 border-white/30 focus:border-purple-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-white/50 border-white/30 focus:border-purple-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white/50 border-white/30 focus:border-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 font-medium">
                  Volunteer Role *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="bg-white/50 border-white/30 focus:border-purple-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Community Roles Section */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-purple-50">
                      Community Roles
                    </div>
                    {volunteerRoles
                      .filter(role => role.category === 'Community')
                      .map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <role.icon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    
                    {/* Skill-Based Roles Section */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-blue-50 mt-2">
                      Skill-Based Roles
                    </div>
                    {volunteerRoles
                      .filter(role => role.category === 'Skill-Based')
                      .map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <role.icon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">
                Experience Level
              </Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger className="bg-white/50 border-white/30 focus:border-purple-500">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Experienced professional</SelectItem>
                  <SelectItem value="expert">Expert - Industry expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-gray-700 font-medium">
                Availability *
              </Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger className="bg-white/50 border-white/30 focus:border-purple-500">
                  <SelectValue placeholder="How much time can you commit?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2-hours">1-2 hours per week</SelectItem>
                  <SelectItem value="3-5-hours">3-5 hours per week</SelectItem>
                  <SelectItem value="6-10-hours">6-10 hours per week</SelectItem>
                  <SelectItem value="10-plus-hours">10+ hours per week</SelectItem>
                  <SelectItem value="project-based">Project-based (as needed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-700 font-medium">
                Skills & Expertise
              </Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="bg-white/50 border-white/30 focus:border-purple-500 min-h-[100px]"
                placeholder="Tell us about your skills, tools you use, and areas of expertise..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation" className="text-gray-700 font-medium">
                Why do you want to volunteer with LightUp? *
              </Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                required
                className="bg-white/50 border-white/30 focus:border-purple-500 min-h-[120px]"
                placeholder="Share your motivation and how you'd like to contribute to our mission..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Volunteer Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
