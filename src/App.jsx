import React, { useMemo, useState } from 'react';
import { Search, ShoppingBag, Menu, ArrowRight, Heart, SlidersHorizontal, X, Check } from 'lucide-react';

const products = [
  { id: 1, name: 'Royal Blue Cotton', category: 'Cotton', price: 180, unit: 'per metre', color: '#243c83', image: 'photo-1528459801416-a9e53bbf4e17', tag: 'Bestseller', description: 'Soft, breathable cotton for everyday wear.' },
  { id: 2, name: 'Ivory Linen Blend', category: 'Linen', price: 320, unit: 'per metre', color: '#ded2b8', image: 'photo-1558618666-fcd25c85cd64', tag: 'New arrival', description: 'An airy linen blend with a beautiful natural texture.' },
  { id: 3, name: 'Rose Floral Print', category: 'Printed', price: 240, unit: 'per metre', color: '#c87c83', image: 'photo-1490481651871-ab68de25d43d', tag: 'Popular', description: 'A graceful floral print for statement outfits.' },
  { id: 4, name: 'Classic Black Suiting', category: 'Suiting', price: 450, unit: 'per metre', color: '#282828', image: 'photo-1598033129183-c4f50c736f10', tag: '', description: 'A refined drape for formal and occasion wear.' },
  { id: 5, name: 'Sage Green Cotton', category: 'Cotton', price: 195, unit: 'per metre', color: '#9ba991', image: 'photo-1605000797499-95a51c5269ae', tag: 'Everyday essential', description: 'A versatile solid shade with a smooth finish.' },
  { id: 6, name: 'Festive Gold Weave', category: 'Ethnic', price: 520, unit: 'per metre', color: '#b79a54', image: 'photo-1610030469983-98e550d6193c', tag: 'Festive edit', description: 'A rich woven look for celebrations and special days.' },
  { id: 7, name: 'Terracotta Texture', category: 'Linen', price: 350, unit: 'per metre', color: '#b66e52', image: 'photo-1529139574466-a303027c1d8b', tag: '', description: 'Warm earthy tones with a tactile finish.' },
  { id: 8, name: 'Midnight Blue Print', category: 'Printed', price: 275, unit: 'per metre', color: '#263958', image: 'photo-1529139574466-a303027c1d8b', tag: 'Limited style', description: 'A deep blue print that works beautifully across seasons.' }
];

const imageUrl = (id, width = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=68`;
const fallbackImage = 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=640&q=68';
const useFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
};

function App() {
  const [category, setCategory] = useState('All Fabrics');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const categories = ['All Fabrics', 'Cotton', 'Linen', 'Printed', 'Suiting', 'Ethnic'];

  const filtered = useMemo(() => products.filter(p =>
    (category === 'All Fabrics' || p.category === category) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  const addToCart = (product) => setCart(old => {
    const found = old.find(p => p.id === product.id);
    return found ? old.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p) : [...old, { ...product, qty: 1 }];
  });
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="site-shell">
      <div className="announcement">A little something for your next creation — explore our new arrivals <span>→</span></div>
      <header className="header">
        <button className="icon-button mobile-toggle" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={21}/></button>
        <a href="#home" className="brand"><span className="brand-mark">U<span>F</span></span><span className="brand-name">URBAN <b>FABRICS</b><small>FABRIC FOR YOUR STORY</small></span></a>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#shop" onClick={() => setMobileMenu(false)}>Shop all</a>
          <a href="#shop" onClick={() => { setCategory('Cotton'); setMobileMenu(false); }}>Cotton</a>
          <a href="#shop" onClick={() => { setCategory('Linen'); setMobileMenu(false); }}>Linen</a>
          <a href="#story" onClick={() => setMobileMenu(false)}>Our story</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search fabrics"/></label>
          <button className="icon-button bag-button" aria-label="Open shopping bag" onClick={() => setCartOpen(true)}><ShoppingBag size={21}/><span className="bag-count">{cartCount}</span></button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span></span> TEXTURES THAT INSPIRE</p>
            <h1>Every great idea<br/>starts with <em>fabric.</em></h1>
            <p className="hero-description">Thoughtfully chosen fabrics for everyday essentials, special occasions, and everything you imagine in between.</p>
            <a className="primary-button" href="#shop">Explore the collection <ArrowRight size={17}/></a>
            <div className="hero-note"><div className="avatar-stack"><i>U</i><i>F</i><i>✦</i></div><span>Made for makers, designers<br/>and dreamers like you.</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-main"><img src={imageUrl('photo-1528459801416-a9e53bbf4e17', 960)} width="960" height="1200" fetchPriority="high" onError={useFallback} alt="Beautiful fabric textures in natural light"/></div>
            <div className="hero-image-small"><img src={imageUrl('photo-1558618666-fcd25c85cd64', 480)} width="480" height="600" loading="lazy" onError={useFallback} alt="Natural linen fabric"/></div>
            <div className="round-stamp"><span>QUALITY<br/>IN EVERY<br/>THREAD</span><b>✳</b></div>
            <div className="image-caption"><span>01 / 04</span><span>THE TEXTURE EDIT</span></div>
          </div>
        </section>

        <section className="benefits">
          <div><span className="benefit-icon">✳</span><p><b>Quality you can feel</b><small>Carefully selected fabrics</small></p></div>
          <div><span className="benefit-icon">⌁</span><p><b>Made for your ideas</b><small>Everyday to occasion wear</small></p></div>
          <div><span className="benefit-icon">♡</span><p><b>Personal service</b><small>Here to help you choose</small></p></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT FAVOURITE</p><h2>Shop the collection<span>.</span></h2></div><a className="text-link" href="#shop" onClick={() => setCategory('All Fabrics')}>View all fabrics <ArrowRight size={16}/></a></div>
          <div className="shop-controls">
            <div className="category-tabs">{categories.map(c => <button key={c} className={category === c ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(c)}>{c}</button>)}</div>
            <span className="results"><SlidersHorizontal size={15}/> {filtered.length} fabrics</span>
          </div>
          <div className="product-grid">
            {filtered.map(p => <article className="product-card" key={p.id}>
              <div className="product-image">
                <img src={imageUrl(p.image)} alt={p.name} width="640" height="800" loading="lazy" decoding="async" onError={useFallback}/>
                {p.tag && <span className="product-tag">{p.tag}</span>}
                <button className={saved.includes(p.id) ? 'save-button saved' : 'save-button'} aria-label="Save fabric" onClick={() => setSaved(s => s.includes(p.id) ? s.filter(id => id !== p.id) : [...s, p.id])}><Heart size={17} fill={saved.includes(p.id) ? 'currentColor' : 'none'}/></button>
                <button className="quick-add" onClick={() => addToCart(p)}>Add to bag <span>+</span></button>
              </div>
              <div className="product-info"><div><p className="product-category">{p.category}</p><h3>{p.name}</h3></div><p className="price">₹{p.price}<small> / m</small></p></div>
              <p className="product-description">{p.description}</p>
              <div className="swatch-row"><span style={{background:p.color}}></span><small>Premium selection</small></div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty-state">No fabrics found. Try another search or category.</div>}
        </section>

        <section className="story-section" id="story">
          <div className="story-photo"><img src={imageUrl('photo-1452860606245-08befc0ff44b', 800)} width="800" height="600" loading="lazy" decoding="async" onError={useFallback} alt="Creative workspace and materials"/></div>
          <div className="story-copy"><p className="eyebrow">A FABRIC STORE WITH A PURPOSE</p><h2>Your vision.<br/><em>Our fabric.</em></h2><p>At Urban Fabrics, we believe the right material can turn a simple idea into something unforgettable. Explore textures, colours and prints chosen to help bring your next creation to life.</p><a href="#shop" className="text-link">Find your fabric <ArrowRight size={16}/></a></div>
        </section>

        <section className="newsletter"><div><p className="eyebrow">STAY IN THE LOOP</p><h2>Good things are <em>in the weave.</em></h2><p>Be the first to discover new textures, colours and collections.</p></div><form onSubmit={e => { e.preventDefault(); alert('Thank you for joining the Urban Fabrics list!'); }}><input type="email" required placeholder="Your email address"/><button type="submit">Join us <ArrowRight size={16}/></button></form></section>
      </main>

      <footer className="footer"><a href="#home" className="brand footer-brand"><span className="brand-mark">U<span>F</span></span><span className="brand-name">URBAN <b>FABRICS</b><small>FABRIC FOR YOUR STORY</small></span></a><p>Materials for the things you dream up.</p><span>© {new Date().getFullYear()} Urban Fabrics. All rights reserved.</span></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag ({cartCount})</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>
        {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={36}/><h3>Your bag is waiting</h3><p>Add a fabric you love to get started.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Continue shopping <ArrowRight size={16}/></button></div> :
          <><div className="cart-items">{cart.map(p => <div className="cart-item" key={p.id}><img src={imageUrl(p.image, 240)} width="72" height="85" loading="lazy" decoding="async" onError={useFallback} alt={p.name}/><div className="cart-item-info"><b>{p.name}</b><small>₹{p.price} / metre</small><div className="quantity"><button onClick={() => setCart(old => old.map(x => x.id === p.id ? {...x, qty: Math.max(1,x.qty-1)} : x))}>−</button><span>{p.qty}</span><button onClick={() => setCart(old => old.map(x => x.id === p.id ? {...x, qty:x.qty+1} : x))}>+</button><button className="remove" onClick={() => setCart(old => old.filter(x => x.id !== p.id))}>Remove</button></div></div><b>₹{p.price*p.qty}</b></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>₹{total}</b></div><small>Shipping and final order details can be confirmed with our team.</small><button className="primary-button checkout-button" onClick={() => alert('Checkout/payment is not connected yet. Add a backend and payment gateway to accept real orders.')}>Continue to checkout <ArrowRight size={16}/></button></div></>}
      </aside></div>}
    </div>
  );
}

export default App;
