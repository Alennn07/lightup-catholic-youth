'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Force this page to be dynamic since it uses useSearchParams
export const dynamic = 'force-dynamic';

function VerifyEmailForm() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const userIdParam = searchParams.get('userId');
    
    if (tokenParam && userIdParam) {
      setToken(tokenParam);
      setUserId(userIdParam);
      verifyEmail(tokenParam, userIdParam);
    } else {
      setIsValidToken(false);
      setIsVerifying(false);
      setError('Invalid verification link. Missing required parameters.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string, userId: string) => {
    try {
      // In a real app, you'd call your API to verify the email
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userId,
        }),
      });

      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Email verified successfully! 🎉",
          description: "Your account is now active. Welcome to LightUp!",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify email');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast({
          title: "Verification email sent! 📧",
          description: "Check your email for a new verification link.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend verification email');
      }
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Verifying Your Email</CardTitle>
            <CardDescription className="text-gray-600">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verified! 🎉</CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to LightUp Catholic Youth Platform!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>Congratulations!</strong> Your email has been verified and your account is now active. 
                You can now access all features of LightUp.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm text-gray-600">
              <p>• Your account is now fully activated</p>
              <p>• You can sign in with your credentials</p>
              <p>• Access all community features</p>
              <p>• Start your faith journey today!</p>
            </div>

            <Button
              onClick={() => router.push('/auth/sign-in')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 font-medium text-base shadow-lg hover:shadow-xl"
            >
              Sign In to Your Account
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full h-12 font-medium text-base"
            >
              Explore LightUp
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Verification Failed</CardTitle>
            <CardDescription className="text-gray-600">
              {error}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                <strong>What happened?</strong> The verification link may be expired, invalid, or already used.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm text-gray-600">
              <p>• Verification links expire after 24 hours</p>
              <p>• Each link can only be used once</p>
              <p>• Check if you copied the full link</p>
            </div>

            <Button
              onClick={resendVerification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium text-base shadow-lg hover:shadow-xl"
            >
              <Mail className="h-4 w-4 mr-2" />
              Resend Verification Email
            </Button>

            <Button
              onClick={() => router.push('/auth/sign-in')}
              variant="outline"
              className="w-full h-12 font-medium text-base"
            >
              Back to Sign In
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Still having trouble?</h3>
              <p className="text-sm text-gray-600">
                If you continue to experience issues, please contact our support team. 
                We're here to help you get started with LightUp!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
