import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { apiRequest } from '../lib/queryClient';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== rePassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Mirrors auth.service.ts register() — agency-level account creation.
      await apiRequest('POST', '/api/auth/register', {
        firstName,
        lastName,
        agencyName: agencyName || `${firstName}'s Agency`,
        email,
        password,
        re_password: rePassword,
      });

      setSuccessMessage('Account created — redirecting to login...');
      setIsOpening(true);
      setTimeout(() => navigate('/login'), 800);
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage(error?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left Section — form */}
      <div
        className={cn(
          'flex-1 flex items-center justify-center p-8 z-10 transition-transform duration-500 ease-in-out',
          isOpening && '-translate-x-full'
        )}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Create your EZCONN account</h1>
            <p className="mt-4 text-lg text-muted-foreground">Start your agency in under a minute</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="agencyName">Agency Name <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                id="agencyName"
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Acme Marketing"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                maxLength={250}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="rePassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="rePassword"
                  type={showRePassword ? 'text' : 'password'}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
                >
                  {showRePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorMessage && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="mt-1 text-sm text-green-600">{successMessage}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Right Section — gradient panel */}
      <div
        className={cn(
          'hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold z-10 transition-transform duration-500 ease-in-out',
          isOpening && 'translate-x-full'
        )}
      >
        <span>*Illustrations Here*</span>
      </div>
    </div>
  );
};

export default SignupPage;
