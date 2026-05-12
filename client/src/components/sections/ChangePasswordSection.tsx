import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">{label}</Label>
      <div className="relative max-w-[300px]">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`pr-12 w-full ${error ? 'border-red-500' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="h-8 w-8"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface PasswordErrors {
  currentPassword: string;
  newPassword: string;
  retypePassword: string;
}

const ChangePasswordSection = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errors, setErrors] = useState<PasswordErrors>({
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const validatePassword = (password: string): string => {
    const validationErrors: string[] = [];
    if (password.length < 8) validationErrors.push("Minimum 8 characters");
    if (!/[A-Z]/.test(password)) validationErrors.push("Upper case letter [A-Z]");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) validationErrors.push("Special character");
    if (!/\d/.test(password)) validationErrors.push("Number [0-9]");
    return validationErrors.join(', ');
  };

  useEffect(() => {
    const newPasswordError = newPassword ? validatePassword(newPassword) : '';
    const retypePasswordError = retypePassword && newPassword !== retypePassword ? "Passwords do not match" : '';

    setErrors(prev => ({
      ...prev,
      newPassword: newPasswordError,
      retypePassword: retypePasswordError,
    }));

    setIsSaveDisabled(
      !currentPassword ||
      !newPassword ||
      !retypePassword ||
      newPasswordError !== '' ||
      retypePasswordError !== ''
    );

  }, [currentPassword, newPassword, retypePassword]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/users/change-password", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setRetypePassword('');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (isSaveDisabled) return;
    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">You can change password for your user account here.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div>
          <p className="text-sm font-medium">Password must contain the following:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 pl-4">
            <li>Minimum 8 characters</li>
            <li>Upper case letter [A-Z]</li>
            <li>Special character</li>
            <li>Number [0-9]</li>
          </ul>
        </div>

        <PasswordInput
          id="current-password"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
        />

        <PasswordInput
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />

        <PasswordInput
          id="retype-password"
          label="Retype New Password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          error={errors.retypePassword}
        />

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaveDisabled || mutation.isPending} 
          className="btn-outline-primary font-normal flex items-center gap-2" 
          variant="outline"
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default ChangePasswordSection;
