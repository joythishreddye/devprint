'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/wizard');
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    display_name: formData.get('display_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Sign-up failed. Please try again.' };
  }

  // If session is null, email confirmation is required
  if (!data.session) {
    return { success: 'Check your email to confirm your account before signing in.' };
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: data.user.id,
      display_name: parsed.data.display_name,
      role: 'developer',
      avatar_url: null,
    });

  if (profileError) {
    console.error('Failed to create user profile:', profileError);
    return { error: 'Account created but profile setup failed. Please contact support.' };
  }

  redirect('/wizard');
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}
