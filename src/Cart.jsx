import { useEffect, useState } from 'react';
import './App.css';

const productsData = [
    {
        id: 1,
        category: 'Electronics',
        name: 'Wireless Headphones',
        tags: ['Bluetooth', 'Noise Cancelling'],
        description: 'High-quality wireless headphones with noise cancellation',
        price: 79.99,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZClaBlsI3bFl1Bg0nT323vSR4rDothxloMNt-ZbcFkQ&s',
        alt: 'Wireless Headphones'
    },
    {
        id: 2,
        category: 'Electronics',
        name: 'Smart Watch',
        tags: ['Fitness', 'GPS'],
        description: 'Feature-rich smartwatch with fitness tracking',
        price: 199.99,
        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Smart+Watch',
        alt: 'Smart Watch'
    },
    {
        id: 3,
        category: 'Sports',
        name: 'Running Shoes',
        tags: ['Comfort', 'Breathable'],
        description: 'Comfortable running shoes for daily training',
        price: 89.99,
        image: 'https://via.placeholder.com/300x200/2ecc71/ffffff?text=Running+Shoes',
        alt: 'Running Shoes'
    },
    {
        id: 4,
        category: 'Sports',
        name: 'Yoga Mat',
        tags: ['Non-slip', 'Eco-friendly'],
        description: 'Non-slip yoga mat for all types of exercises',
        price: 29.99,
        image: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Yoga+Mat',
        alt: 'Yoga Mat'
    },
    {
        id: 5,
        category: 'Home',
        name: 'Coffee Maker',
        tags: ['Programmable', '12 Cup'],
        description: 'Programmable coffee maker with thermal carafe',
        price: 59.99,
        image: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Coffee+Maker',
        alt: 'Coffee Maker'
    },
    {
        id: 6,
        category: 'Home',
        name: 'Blender',
        tags: ['Powerful', 'Multi-speed'],
        description: 'Powerful blender for smoothies and more',
        price: 49.99,
        image: 'https://via.placeholder.com/300x200/1abc9c/ffffff?text=Blender',
        alt: 'Blender'
    },
    {
        id: 7,
        category: 'Accessories',
        name: 'Backpack',
        tags: ['Durable', 'Laptop'],
        description: 'Durable backpack with laptop compartment',
        price: 45.99,
        image: 'https://via.placeholder.com/300x200/34495e/ffffff?text=Backpack',
        alt: 'Backpack'
    },
    {
        id: 8,
        category: 'Accessories',
        name: 'Sunglasses',
        tags: ['UV Protection', 'Polarized'],
        description: 'Stylish sunglasses with UV protection',
        price: 39.99,
        image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Sunglasses',
        alt: 'Sunglasses'
    }
];

const STORAGE_KEY = 'shopping-cart-items';

const Cart = () => {
    const [products] = useState(productsData);
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            const storedCart = window.localStorage.getItem(STORAGE_KEY);
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Unable to load cart from storage', error);
            return [];
        }
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Products');
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (productId, change) => {
        setCartItems((prevItems) =>
            prevItems.flatMap((item) => {
                if (item.id !== productId) {
                    return [item];
                }

                const nextQuantity = item.quantity + change;
                return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
            })
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const categories = ['All Products', ...new Set(products.map((product) => product.category))];
    const filteredProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="products-page">
            <header className="page-hero">
                <div>
                    <p className="hero-eyebrow">Premium Shopping Experience</p>
                    <h1>Crafted for modern online stores</h1>
                    <p className="hero-copy">
                        Browse curated products, manage your cart instantly, and keep everything saved for your next visit.
                    </p>
                </div>
                <button className="cart-button" type="button" onClick={() => setIsCartOpen(true)}>
                    <span className="cart-icon">🛒</span>
                    <span className="cart-text">View Cart</span>
                    <span className="cart-count">{cartCount}</span>
                </button>
            </header>

            <div className="content-shell">
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <label className="sidebar-label" htmlFor="product-search">Search</label>
                        <input
                            id="product-search"
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="sidebar-section">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            {categories.map((category) => (
                                <li
                                    key={category}
                                    className={activeCategory === category ? 'active' : ''}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-section summary-card">
                        <h3>Cart Summary</h3>
                        <div className="summary-row">
                            <span>Items</span>
                            <strong>{cartCount}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Total</span>
                            <strong>${totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                </aside>

                <main className="products-main">
                    <div className="products-header">
                        <div>
                            <h2>Featured Products</h2>
                            <p>{filteredProducts.length} products available</p>
                        </div>
                        <button className="secondary-action" type="button" onClick={() => setIsCartOpen(true)}>
                            Open Cart
                        </button>
                    </div>

                    <div className="products-grid">
                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <h3>No products match your search.</h3>
                                <p>Try a different keyword or category.</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <article className="product-card" key={product.id}>
                                    <div className="product-image">
                                        <img src={product.image} alt={product.alt} />
                                    </div>
                                    <div className="product-details">
                                        <p className="product-category">{product.category}</p>
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-tags">
                                            {product.tags.map((tag) => (
                                                <span className="tag" key={tag}>{tag}</span>
                                            ))}
                                        </div>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">${product.price.toFixed(2)}</span>
                                            <button className="btn-add-to-cart" type="button" onClick={() => addToCart(product)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {isCartOpen && (
                <div className="modal-backdrop" role="presentation" onClick={() => setIsCartOpen(false)}>
                    <div className="cart-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                        <div className="cart-modal-header">
                            <div>
                                <p className="hero-eyebrow">Your Cart</p>
                                <h3>{cartCount} item{cartCount === 1 ? '' : 's'} selected</h3>
                            </div>
                            <button className="icon-button" type="button" onClick={() => setIsCartOpen(false)}>
                                ✕
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <p>Your cart is empty.</p>
                                <button className="secondary-action" type="button" onClick={() => setIsCartOpen(false)}>
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items-list">
                                    {cartItems.map((item) => (
                                        <div className="cart-item-row" key={item.id}>
                                            <div>
                                                <h4>{item.name}</h4>
                                                <p>${item.price.toFixed(2)} each</p>
                                            </div>
                                            <div className="quantity-controls">
                                                <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                                                    +
                                                </button>
                                            </div>
                                            <div className="cart-item-actions">
                                                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                                <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-modal-footer">
                                    <div className="summary-row">
                                        <span>Total</span>
                                        <strong>${totalAmount.toFixed(2)}</strong>
                                    </div>
                                    <div className="cart-actions">
                                        <button className="secondary-action" type="button" onClick={clearCart}>
                                            Clear Cart
                                        </button>
                                        <button className="cart-button" type="button" onClick={() => setIsCartOpen(false)}>
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;

