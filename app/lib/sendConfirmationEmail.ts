// Client-safe — just a fetch wrapper, no server imports
export async function sendConfirmationEmail(
  email: string,
  firstName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error ?? 'Failed to send email' };
    }

    return { success: true };
  } catch (err) {
    console.error('sendConfirmationEmail error:', err);
    return { success: false, error: 'Network error' };
  }
}