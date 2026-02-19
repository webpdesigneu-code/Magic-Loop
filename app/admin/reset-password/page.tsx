'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../admin.module.css'; // Re-use admin styles

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage('Hasła nie są identyczne');
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => router.push('/admin'), 2000);
            } else {
                const data = await res.json();
                setMessage(data.error || 'Błąd resetowania hasła');
                setStatus('error');
            }
        } catch {
            setMessage('Wystąpił błąd serwera');
            setStatus('error');
        }
    };

    if (!token) {
        return <div className={styles.container}><h1>Błąd</h1><p>Brak tokena resetującego.</p></div>;
    }

    if (status === 'success') {
         return (
             <div className={styles.container}>
                 <h1>Sukces! 🎉</h1>
                 <p>Hasło zostało zmienione. Przekierowywanie do logowania...</p>
             </div>
         );
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <h1>Reset Hasła</h1>
                    <p>Wprowadź nowe hasło dla swojego konta.</p>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nowe hasło"
                        className={styles.input}
                        required
                        minLength={8}
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Potwierdź hasło"
                        className={styles.input}
                        required
                        style={{marginTop: '10px'}}
                    />

                    {status === 'error' && <p className={styles.error}>{message}</p>}

                    <button type="submit" className={styles.button} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Zmienianie...' : 'Zmień hasło'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Ładowanie...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
