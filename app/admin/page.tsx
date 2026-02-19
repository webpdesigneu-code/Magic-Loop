'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Product, ProductStatus, Order } from '@/lib/types';
import styles from './admin.module.css';



export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
    const [settings, setSettings] = useState({ notificationEmail: '' });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/auth');
            const data = await res.json();
            setIsAuthenticated(data.authenticated);
            if (data.authenticated) {
                loadProducts();
                loadOrders();
                loadSettings();
            }
        } catch {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const [email, setEmail] = useState('');
    const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                loadProducts();
                loadOrders();
                loadSettings();
            } else {
                const data = await res.json();
                setError(data.error || 'Błąd logowania');
            }
        } catch {
            setError('Błąd połączenia');
        }
    };

    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
             // Basic email validation
             if (!email) {
                 setError('Podaj adres email');
                 return;
             }

             const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            
            // Always show success to prevent enumeration
            setResetSent(true);

        } catch (err) {
            setError('Wystąpił błąd. Spróbuj ponownie.');
        }
    }

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        setIsAuthenticated(false);
        setProducts([]);
        setOrders([]);
    };

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error('Failed to load products:', err);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error('Failed to load orders:', err);
        }
    };

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.notificationEmail) {
                setSettings(data);
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
        }
    };

    const handleSaveSettings = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                alert('Ustawienia zapisane!');
            } else {
                alert('Błąd zapisu ustawień');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Błąd zapisu ustawień');
        }
    };

    const handleSaveProduct = async (product: Partial<Product>) => {
        try {
            if (editingProduct) {
                await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingProduct.id, ...product }),
                });
            } else {
                await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                });
            }
            loadProducts();
            setEditingProduct(null);
            setIsCreating(false);
        } catch (err) {
            console.error('Failed to save product:', err);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return;

        try {
            await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            loadProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status }),
            });
            loadOrders();
        } catch (err) {
            console.error('Failed to update order:', err);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Ładowanie...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                {authMode === 'login' ? (
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <h1>🔐 Panel Administracyjny</h1>
                        <p>Magic Loop</p>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Hasło"
                            className={styles.input}
                            required
                            style={{marginTop: '10px'}}
                        />

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className={styles.button}>
                            Zaloguj się
                        </button>
                        
                        <button 
                            type="button" 
                            className={styles.linkButton}
                            onClick={() => { setAuthMode('forgot'); setError(''); }}
                            style={{marginTop: '15px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline'}}
                        >
                            Zapomniałeś hasła?
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword} className={styles.loginForm}>
                        <h2>🔑 Resetowanie hasła</h2>
                        <p>Podaj email powiązany z kontem</p>
                        
                        {!resetSent ? (
                            <>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className={styles.input}
                                    required
                                />

                                {error && <p className={styles.error}>{error}</p>}

                                <button type="submit" className={styles.button}>
                                    Wyślij link resetujący
                                </button>
                            </>
                        ) : (
                            <div className={styles.successMessage} style={{color: 'green', margin: '20px 0'}}>
                                <p>Jeśli konto istnieje, wysłaliśmy link do resetowania hasła na podany adres.</p>
                            </div>
                        )}

                        <button 
                            type="button" 
                            className={styles.linkButton}
                            onClick={() => { setAuthMode('login'); setError(''); setResetSent(false); }}
                            style={{marginTop: '15px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline'}}
                        >
                            &larr; Wróć do logowania
                        </button>
                    </form>
                )}
            </div>
        );
    }

    const newOrdersCount = orders.filter(o => o.status === 'new').length;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>🎀 Magic Loop - CMS</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Wyloguj
                </button>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    📦 Produkty ({products.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    📋 Zamówienia
                    {newOrdersCount > 0 && (
                        <span className={styles.badge}>{newOrdersCount}</span>
                    )}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    ⚙️ Ustawienia
                </button>
            </div>

            <main className={styles.main}>
                {activeTab === 'products' ? (
                    <>
                        <div className={styles.toolbar}>
                            <h2>Zarządzaj produktami</h2>
                            <button
                                onClick={() => { setIsCreating(true); setEditingProduct(null); }}
                                className={styles.addBtn}
                            >
                                + Dodaj produkt
                            </button>
                        </div>

                        {(isCreating || editingProduct) && (
                            <ProductForm
                                product={editingProduct}
                                onSave={handleSaveProduct}
                                onCancel={() => { setIsCreating(false); setEditingProduct(null); }}
                            />
                        )}

                        <div className={styles.productGrid}>
                            {products.sort((a, b) => (a.order || 0) - (b.order || 0)).map(product => (
                                <div key={product.id} className={`${styles.productCard} ${product.status === 'hidden' ? styles.hidden : ''}`}>
                                    {product.salePrice && (
                                        <div className={styles.saleBadge}>PROMOCJA</div>
                                    )}
                                    <div className={styles.productImage}>
                                        {product.images[0] ? (
                                            <img src={product.images[0]} alt={product.name.pl} />
                                        ) : (
                                            <span>🧸</span>
                                        )}
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h3>{product.name.pl}</h3>
                                        <p className={styles.productCategory}>{product.category}</p>
                                        <div className={styles.priceDisplay}>
                                            {product.salePrice ? (
                                                <>
                                                    <span className={styles.oldPrice}>{product.price.PLN} PLN</span>
                                                    <span className={styles.newPrice}>{product.salePrice.PLN} PLN</span>
                                                </>
                                            ) : (
                                                <span>{product.price.PLN} PLN / {product.price.SEK} SEK</span>
                                            )}
                                        </div>
                                        <span className={`${styles.statusChip} ${styles[`status-${product.status}`]}`}>
                                            {product.status === 'available' && '✅ Dostępny'}
                                            {product.status === 'on-order' && '⏳ Na zamówienie'}
                                            {product.status === 'sold-out' && '❌ Wyprzedane'}
                                            {product.status === 'hidden' && '👁️‍🗨️ Ukryty'}
                                        </span>
                                        <div className={styles.productActions}>
                                            <button onClick={() => setEditingProduct(product)}>
                                                ✏️ Edytuj
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className={styles.deleteBtn}
                                            >
                                                🗑️ Usuń
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'settings' ? (
                    <>
                        <div className={styles.toolbar}>
                            <h2>⚙️ Ustawienia aplikacji</h2>
                        </div>
                        <div className={styles.card}>
                            <form onSubmit={handleSaveSettings} className={styles.settingsForm}>
                                <div className={styles.formGroup}>
                                    <label>Email do powiadomień</label>
                                    <p className={styles.hint}>Na ten adres będą przychodzić powiadomienia o nowych zamówieniach.</p>
                                    <input
                                        type="email"
                                        value={settings.notificationEmail}
                                        onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                                        className={styles.input}
                                        placeholder="np. anna@example.com"
                                    />
                                </div>
                                <button type="submit" className={styles.saveBtn}>
                                    💾 Zapisz ustawienia
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.toolbar}>
                            <h2>Zapytania od klientów</h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span>📭</span>
                                <p>Brak zapytań</p>
                            </div>
                        ) : (
                            <div className={styles.ordersList}>
                                {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                                    <div key={order.id} className={`${styles.orderCard} ${styles[`order-${order.status}`]}`}>
                                        <div className={styles.orderHeader}>
                                            <strong>{order.productName}</strong>
                                            <span className={styles.orderDate}>
                                                {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                                            </span>
                                        </div>
                                        <div className={styles.orderDetails}>
                                            <p><strong>Klient:</strong> {order.customerName}</p>
                                            <p><strong>Email:</strong> <a href={`mailto:${order.email}`}>{order.email}</a></p>
                                            {order.phone && <p><strong>Telefon:</strong> {order.phone}</p>}
                                            <p><strong>Kraj:</strong> {order.country}</p>
                                            <p><strong>Adres:</strong> {order.address}</p>
                                            {order.message && <p><strong>Wiadomość:</strong> {order.message}</p>}
                                        </div>
                                        <div className={styles.orderActions}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                            >
                                                <option value="new">🆕 Nowe</option>
                                                <option value="contacted">📞 Skontaktowano</option>
                                                <option value="completed">✅ Zrealizowane</option>
                                                <option value="cancelled">❌ Anulowane</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

interface ProductFormProps {
    product: Product | null;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        slug: product?.slug || '',
        category: product?.category || 'pluszaki',
        namePl: product?.name.pl || '',
        nameSe: product?.name.se || '',
        descPl: product?.description.pl || '',
        descSe: product?.description.se || '',
        pricePLN: product?.price.PLN || 0,
        priceSEK: product?.price.SEK || 0,
        salePricePLN: product?.salePrice?.PLN || '',
        salePriceSEK: product?.salePrice?.SEK || '',
        status: product?.status || 'available' as ProductStatus,
        order: product?.order || 1,
    });
    const [images, setImages] = useState<string[]>(product?.images || []);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const formDataUpload = new FormData();
        Array.from(files).forEach(file => formDataUpload.append('files', file));

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.paths) {
                setImages(prev => [...prev, ...data.paths]);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const salePrice = formData.salePricePLN && formData.salePriceSEK
            ? { PLN: Number(formData.salePricePLN), SEK: Number(formData.salePriceSEK) }
            : undefined;

        onSave({
            slug: formData.slug || formData.namePl.toLowerCase().replace(/\s+/g, '-'),
            category: formData.category,
            images,
            name: { pl: formData.namePl, se: formData.nameSe },
            description: { pl: formData.descPl, se: formData.descSe },
            price: { PLN: Number(formData.pricePLN), SEK: Number(formData.priceSEK) },
            salePrice,
            status: formData.status,
            order: Number(formData.order),
            available: formData.status === 'available' || formData.status === 'on-order',
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <h3>{product ? '✏️ Edytuj produkt' : '➕ Nowy produkt'}</h3>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Nazwa (PL) *</label>
                    <input
                        type="text"
                        value={formData.namePl}
                        onChange={e => setFormData({ ...formData, namePl: e.target.value })}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Nazwa (SE) *</label>
                    <input
                        type="text"
                        value={formData.nameSe}
                        onChange={e => setFormData({ ...formData, nameSe: e.target.value })}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Kategoria</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="pluszaki">Pluszaki</option>
                        <option value="dekoracje">Dekoracje</option>
                        <option value="kwiaty">Kwiaty</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    >
                        <option value="available">✅ Dostępny</option>
                        <option value="on-order">⏳ Na zamówienie</option>
                        <option value="sold-out">❌ Wyprzedane</option>
                        <option value="hidden">👁️ Ukryty</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Kolejność</label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                        min="1"
                    />
                </div>
            </div>

            <div className={styles.priceSection}>
                <h4>💰 Ceny</h4>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Cena (PLN) *</label>
                        <input
                            type="number"
                            value={formData.pricePLN}
                            onChange={e => setFormData({ ...formData, pricePLN: Number(e.target.value) })}
                            required
                            min="0"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Cena (SEK) *</label>
                        <input
                            type="number"
                            value={formData.priceSEK}
                            onChange={e => setFormData({ ...formData, priceSEK: Number(e.target.value) })}
                            required
                            min="0"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.saleSection}>
                <h4>🏷️ Cena promocyjna (opcjonalnie)</h4>
                <p className={styles.hint}>Zostaw puste, jeśli produkt nie jest w promocji</p>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Cena promocyjna (PLN)</label>
                        <input
                            type="number"
                            value={formData.salePricePLN}
                            onChange={e => setFormData({ ...formData, salePricePLN: e.target.value })}
                            min="0"
                            placeholder="np. 49"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Cena promocyjna (SEK)</label>
                        <input
                            type="number"
                            value={formData.salePriceSEK}
                            onChange={e => setFormData({ ...formData, salePriceSEK: e.target.value })}
                            min="0"
                            placeholder="np. 119"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>Opis (PL)</label>
                <textarea
                    value={formData.descPl}
                    onChange={e => setFormData({ ...formData, descPl: e.target.value })}
                    rows={3}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Opis (SE)</label>
                <textarea
                    value={formData.descSe}
                    onChange={e => setFormData({ ...formData, descSe: e.target.value })}
                    rows={3}
                />
            </div>

            <div className={styles.formGroup}>
                <label>📷 Zdjęcia</label>
                <div className={styles.imageGrid}>
                    {images.map((img, idx) => (
                        <div key={idx} className={styles.imageThumb}>
                            <img src={img} alt="" />
                            <button type="button" onClick={() => removeImage(idx)}>×</button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                />
                {uploading && <span>Przesyłanie...</span>}
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                    💾 Zapisz
                </button>
                <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                    Anuluj
                </button>
            </div>
        </form>
    );
}
