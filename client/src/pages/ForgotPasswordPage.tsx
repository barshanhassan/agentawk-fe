import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { cn } from '../lib/utils';
import { toast } from '../hooks/use-toast'; // Import toast

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [, navigate] = useLocation();

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Password Reset",
        description: `Password reset link sent to ${email}.`,
        variant: "default", // You can choose a variant like "success" or "default"
      });
      navigate('/login'); // Redirect back to login after sending link
    } else {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive", // Use a destructive variant for errors
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">Forgot Password?</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter your business email and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSendResetLink} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>

          <div className="text-center">
            <a href="/login" className="text-sm text-primary font-semibold hover:underline">
              &lt; Back to login
            </a>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-8">
            <p>&copy; 2025 EZCONN. <a href="https://ezauq.com/privacy-and-policy" target='_blank' rel="noopener noreferrer" className="hover:underline text-primary">Privacy Policy</a> | <a href="https://ezauq.com/terms-of-service" target='_blank' rel="noopener noreferrer" className="hover:underline text-primary">Terms of Service</a></p>
          </div>
        </div>
      </div>

      {/* Right Section - Gradient with Text */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white text-2xl font-bold">
        <span>*Illustrations Here*</span>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
