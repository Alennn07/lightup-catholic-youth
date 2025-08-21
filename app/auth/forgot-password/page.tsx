'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you'd call your API to send reset email
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsEmailSent(true);
        toast({
          title: "Reset link sent! 📧",
          description: "Check your email for a password reset link. It may take a few minutes to arrive.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Check Your Email! 📧</CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>What's next?</strong> Click the link in your email to reset your password. The link will expire in 1 hour for security.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm text-gray-600">
              <p>• Check your spam/junk folder if you don't see it</p>
              <p>• Make sure you entered the correct email address</p>
              <p>• The email may take a few minutes to arrive</p>
            </div>

            <Button
              onClick={() => setIsEmailSent(false)}
              variant="outline"
              className="w-full h-12 font-medium text-base"
            >
              Try a different email
            </Button>

            <Button
              onClick={() => router.push('/auth/sign-in')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium text-base shadow-lg hover:shadow-xl"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Forgot Your Password?</CardTitle>
          <CardDescription className="text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="h-12 border-2 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Security note:</strong> We'll only send a reset link to your registered email address. 
                If you don't have access to this email, contact support.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 font-medium text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Send Reset Link</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/auth/sign-in')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you're still having trouble, you can:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check if your email is correct</li>
              <li>• Wait a few minutes for the email to arrive</li>
              <li>• Contact our support team</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
