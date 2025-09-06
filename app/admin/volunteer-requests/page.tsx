'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Code, 
  Palette, 
  Megaphone, 
  BookOpen, 
  Camera, 
  Music, 
  Globe,
  Eye,
  EyeOff,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: string | null;
  availability: string;
  motivation: string;
  skills: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

const roleIcons: { [key: string]: any } = {
  'developer': Code,
  'designer': Palette,
  'content-writer': BookOpen,
  'marketing': Megaphone,
  'photographer': Camera,
  'musician': Music,
  'translator': Globe,
  'other': Users,
};

const statusColors: { [key: string]: string } = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'reviewed': 'bg-blue-100 text-blue-800',
  'accepted': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
};

export default function VolunteerRequestsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lightup2024') {
      setIsAuthenticated(true);
      setError('');
      fetchApplications();
    } else {
      setError('Incorrect password');
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/volunteer');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch volunteer applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Experience', 'Availability', 'Skills', 'Motivation', 'Status', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.name}"`,
        `"${app.email}"`,
        `"${app.phone || 'N/A'}"`,
        `"${app.role}"`,
        `"${app.experience || 'N/A'}"`,
        `"${app.availability}"`,
        `"${app.skills || 'N/A'}"`,
        `"${app.motivation.replace(/"/g, '""')}"`,
        `"${app.status}"`,
        `"${new Date(app.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 font-outfit">
                Admin Access
              </CardTitle>
              <p className="text-gray-700 font-nunito-sans">
                Enter password to view volunteer applications
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50 border-white/30 focus:border-purple-500 pr-10"
                      placeholder="Enter admin password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                >
                  Access Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 font-outfit mb-2">
                Volunteer Applications
              </h1>
              <p className="text-gray-700 font-nunito-sans text-lg">
                Manage volunteer applications and requests
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchApplications}
                disabled={isLoading}
                variant="outline"
                className="bg-white/50 border-white/30 hover:bg-white/70"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : applications.length === 0 ? (
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">No volunteer applications have been submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application, index) => {
              const IconComponent = roleIcons[application.role] || Users;
              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 font-outfit">
                              {application.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">{application.email}</span>
                            </div>
                            {application.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{application.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <Badge className={statusColors[application.status]}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(application.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Role & Experience</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Role:</span> {application.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Experience:</span> {application.experience || 'Not specified'}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Availability:</span> {application.availability}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                          <p className="text-sm text-gray-700">
                            {application.skills || 'No skills specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Motivation</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {application.motivation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
