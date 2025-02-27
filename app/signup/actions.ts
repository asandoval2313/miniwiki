'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type SignupState = {
  error: string | null;
};

export async function signup(
  state: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
  };

  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', data.email)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.log('Error checking existing user:', checkError);
    return { error: 'Error checking existing user.' };
  }

  if (existingUser) {
    return { error: 'Email already registered' };
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
