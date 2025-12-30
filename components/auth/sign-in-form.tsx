"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { numoniLogoDark } from "@/constant/icons";
import { SIGN_UP_URL } from "@/constant/routes";
import { useSignIn } from "@/hooks/mutation/useSignIn";
import { generateUUID } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { handleSignIn, isPending } = useSignIn();


  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    // console.log("Sign in attempt:", data);

    const payload = {
      username: data.email,
      password: data.password,
      usertype: 'MERCHANT',
      deviceId: generateUUID(),
    }
    handleSignIn(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8">
        <Image src={numoniLogoDark} alt="Logo" width={100} height={100} />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border-l-4 border-t-4 border-green-200 p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm">
            Enter your Email and password to login
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Phone Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-6 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
                className="flex-1 bg-theme-dark-green hover:bg-green-700  text-white py-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:bg-theme-dark-green"
                loadingText="Signing In..."
                isLoading={isPending}
              >
                Sign In
              </Button>
            </div>
          </form>
        </Form>

        <div className="flex items-center justify-center my-3">
          <span className="text-sm text-gray-500">
            Don&apos;t have an account? <Link href={SIGN_UP_URL} className="text-theme-dark-green hover:underline font-medium">Sign Up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}