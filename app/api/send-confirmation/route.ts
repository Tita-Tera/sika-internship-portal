import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// This runs on the SERVER only — API key is safe here
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Tera-Tech Ltd Internships <teratechcompanyltd@gmail.com>', // ← replace with your verified sender
      to: email,
      subject: 'Application Received — Tera-Tech Ltd Internship Programme',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #18181b;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Application Received ✓</h1>
          </div>
          <div style="border: 1px solid #e4e4e7; border-top: none; padding: 32px; border-radius: 0 0 16px 16px;">
            <p style="margin: 0 0 16px;">Hi <strong>${firstName ?? 'there'}</strong>,</p>
            <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
              Thank you for applying to the <strong>Tera-Tech Ltd Internship Programme</strong>. 
              We've received your application and our team will review it within 
              <strong>5 business days</strong>.
            </p>
            <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
              You'll hear from us with next steps. If you have any questions before then, 
              reply to this email or visit our contact page.
            </p>
            <div style="background: #f4f4f5; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 13px; color: #71717a;">
                Didn't receive this email in your main inbox? Check your spam folder and mark us as safe.
              </p>
            </div>
            <p style="margin: 0; color: #52525b;">
              Best regards,<br/>
              <strong>The Tera-Tech Ltd Internship Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Send confirmation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}