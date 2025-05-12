// utils/sendOtpEmail.ts
import { Resend } from 'resend';
import { EmailOTPTemplate } from '@/lib/email/OTPTemplate';
import supabase from '@/lib/db';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail({
  email,
  otp,
  firstName,
}: {
  email: string;
  otp: string;
  firstName: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'DevFlow <devflow@assemblers.live>',
    to: [email],
    subject: 'Verify your email address',
    react: await EmailOTPTemplate({ firstName, otp }),
  });

  if (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }

  return data;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
}

export async function requestOtp(email: string, firstName: string) {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Store OTP
  const { data, error } = await supabase.clientTable.from('email_otps').insert({
    email,
    otp,
    purpose: 'email_change',
    expires_at: expiresAt.toISOString(),
  }).select().single();

  if (error) throw new Error('Failed to save OTP');

  await sendOtpEmail({ email, otp, firstName });

  return data.id;
}

export async function resendOtp(oldOTPId: string) {

  const { data: oldOtpData, error: oldOtpError } = await supabase.clientTable
    .from('email_otps')
    .select('*')
    .eq('id', oldOTPId)
    .single();
  if (oldOtpError || !oldOtpData) {
    throw new Error('Failed to fetch old OTP data');
  }
  const { email, first_name: firstName } = oldOtpData;

  await supabase.clientTable
    .from('email_otps')
    .delete()
    .eq('id', oldOTPId);

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Store OTP
  const { data, error } = await supabase.clientTable.from('email_otps').insert({
    email,
    otp,
    purpose: 'email_change',
    expires_at: expiresAt.toISOString(),
  }).select().single();

  if (error) throw new Error('Failed to save OTP');

  await sendOtpEmail({ email, otp, firstName });

  return data.id;
}

export async function verifyOtp(email: string, otp: string) {
  const { data, error } = await supabase.clientTable
    .from('email_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .eq('purpose', 'email_change')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  console.log('response from supabase:', { data, error });

  if (error || !data || data.length === 0) {
    throw new Error('Invalid OTP');
  }


  if (new Date(data.expires_at) < new Date()) {
    throw new Error('OTP expired');
  }

  // Mark as used
  await supabase.clientTable
    .from('email_otps')
    .delete()
    .eq('id', data.id);

  return { verified: true };
}
