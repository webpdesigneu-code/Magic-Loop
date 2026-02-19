'use client';

import { useTranslation } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
    const { t, language } = useTranslation();

    return (
        <main>
            <Header />
            <div style={{
                padding: '120px 20px 80px',
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-gray-800)',
                lineHeight: '1.8'
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-primary)',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>{t('privacy.title')}</h1>

                {language === 'pl' ? (
                    <div className="policy-content">
                        <section>
                            <h3>1. Informacje ogólne</h3>
                            <p>Strona Magic Loop dba o Twoją prywatność. Niniejsza polityka wyjaśnia, jakie dane zbieramy i jak ich używamy.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>2. Dane osobowe</h3>
                            <p>Zbieramy dane (imię, email, adres) tylko wtedy, gdy dobrowolnie wypełnisz formularz zamówienia. Dane te są używane wyłącznie do realizacji Twojego zapytania i kontaktu z Tobą.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>3. Pliki Cookies (Ciasteczka)</h3>
                            <p>Używamy plików cookies, aby:</p>
                            <ul>
                                <li>Zapamiętać Twoje preferencje językowe.</li>
                                <li>Zapewnić poprawne działanie formularzy.</li>
                                <li>Analizować anonimowy ruch na stronie (jeśli dotyczy).</li>
                            </ul>
                            <p>Możesz w każdej chwili zablokować cookies w ustawieniach swojej przeglądarki.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>4. Kontakt</h3>
                            <p>W sprawach dotyczących Twoich danych możesz pisać na: apietrowicz87@gmail.com</p>
                        </section>
                    </div>
                ) : (
                    <div className="policy-content">
                        <section>
                            <h3>1. Allmän information</h3>
                            <p>Magic Loop-webbplatsen värnar om din integritet. Denna policy förklarar vilka uppgifter vi samlar in och hur vi använder dem.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>2. Personuppgifter</h3>
                            <p>Vi samlar endast in uppgifter (namn, e-post, adress) när du frivilligt fyller i beställningsformuläret. Dessa uppgifter används endast för att hantera din förfrågan och kontakta dig.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>3. Cookies</h3>
                            <p>Vi använder cookies för att:</p>
                            <ul>
                                <li>Komma ihåg dina språkinställningar.</li>
                                <li>Säkerställa att formulär fungerar korrekt.</li>
                                <li>Analysera anonym trafik på webbplatsen (om tillämpligt).</li>
                            </ul>
                            <p>Du kan när som helst blockera cookies i din webbläsares inställningar.</p>
                        </section>

                        <section style={{ marginTop: '30px' }}>
                            <h3>4. Kontakt</h3>
                            <p>För frågor gällande dina uppgifter kan du skriva till: apietrowicz87@gmail.com</p>
                        </section>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
