import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Lazy initialization to avoid errors during build
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || 're_ExfjwLKg_47H1s3J7ntdyu3KBBTEdH1JS';
  if (!resend && apiKey) {
    resend = new Resend(apiKey);
  }
  return resend;
}

function getNotificationEmail(): string {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(data);
      if (settings.notificationEmail) {
        return settings.notificationEmail;
      }
    }
  } catch (e) {
    console.error('Failed to read settings for email', e);
  }
  return process.env.ANNA_EMAIL || 'anna@example.com';
}

interface OrderEmailData {
  productName: string;
  productPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  country: string;
  address: string;
  message?: string;
  language: 'pl' | 'se';
}

export async function sendOrderNotification(data: OrderEmailData): Promise<boolean> {
  const annaEmail = getNotificationEmail();
  const client = getResendClient();

  if (!client) {
    console.warn('Resend API key not configured. Email not sent.');
    return false;
  }

  try {
    // Email to Anna
    await client.emails.send({
      from: 'Magic Loop <orders@gmbhub.pl>',
      to: annaEmail,
      subject: `🛒 Nowe zapytanie: ${data.productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7CB342;">📦 Nowe zapytanie o produkt!</h2>
          
          <div style="background: #FFF8E1; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Produkt</h3>
            <p><strong>${data.productName}</strong></p>
            <p>Cena: ${data.productPrice}</p>
          </div>
          
          <div style="background: #F8BBD9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Dane klienta</h3>
            <p><strong>Imię:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
            ${data.customerPhone ? `<p><strong>Telefon:</strong> ${data.customerPhone}</p>` : ''}
            <p><strong>Kraj:</strong> ${data.country}</p>
            <p><strong>Adres:</strong> ${data.address}</p>
          </div>
          
          ${data.message ? `
          <div style="background: #E1F5FE; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Wiadomość od klienta</h3>
            <p>${data.message}</p>
          </div>
          ` : ''}
          
          <p style="color: #666; font-size: 14px;">
            Odpowiedz bezpośrednio na ten email lub skontaktuj się z klientem.
          </p>
        </div>
      `,
    });

    // Confirmation email to customer
    const isPolish = data.language === 'pl';
    await client.emails.send({
      from: 'Magic Loop <orders@gmbhub.pl>',
      to: data.customerEmail,
      subject: isPolish
        ? '💝 Dziękuję za Twoje zapytanie! - Magic Loop'
        : '💝 Tack för din förfrågan! - Magic Loop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7CB342;">
            ${isPolish ? '💝 Dziękuję za Twoje zapytanie!' : '💝 Tack för din förfrågan!'}
          </h2>
          
          <p>
            ${isPolish
          ? `Cześć ${data.customerName}!`
          : `Hej ${data.customerName}!`}
          </p>
          
          <p>
            ${isPolish
          ? 'Dziękuję za zainteresowanie moimi produktami handmade! Otrzymałam Twoje zapytanie dotyczące:'
          : 'Tack för ditt intresse för mina handgjorda produkter! Jag har mottagit din förfrågan om:'}
          </p>
          
          <div style="background: #FFF8E1; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0; color: #E53935;">${data.productName}</h3>
            <p style="margin: 10px 0 0; font-size: 18px;">${data.productPrice}</p>
          </div>
          
          <p>
            ${isPolish
          ? 'Odpowiem najszybciej jak to możliwe z informacjami o dostępności i szczegółach zamówienia.'
          : 'Jag återkommer så snart som möjligt med information om tillgänglighet och beställningsdetaljer.'}
          </p>
          
          <p>
            ${isPolish
          ? 'Pozdrawiam serdecznie,'
          : 'Vänliga hälsningar,'}
            <br><br>
            <strong>Anna</strong><br>
            <span style="color: #7CB342;">Magic Loop</span>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            ${isPolish
          ? 'Ta wiadomość została wysłana automatycznie. Proszę nie odpowiadaj na nią - odpowiem osobiście wkrótce!'
          : 'Detta meddelande skickades automatiskt. Vänligen svara inte på det - jag återkommer personligen snart!'}
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

