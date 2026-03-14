'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/rice';

export default function RiceCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: selectedSize.code,
        name: product.name,
        size: selectedSize.size,
        price: selectedSize.price,
        emoji: product.emoji,
        code: selectedSize.code,
      });
    }
    setQty(1);
  };

  return (
    <div className="rc-card">
      {/* Image */}
      <div className="rc-img-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
        {product.badge && (
          <span
            className={`badge ${product.badge.type}`}
            style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1 }}
          >
            {product.badge.label}
          </span>
        )}
      </div>

      <div className="rc-body">
        <div className="rc-variety">{product.variety}</div>
        <div className="rc-name">
          {product.name}
          {product.subtitle && (
            <em style={{ fontSize: '0.8em', fontWeight: 400, color: 'var(--tl)' }}> ({product.subtitle})</em>
          )}
        </div>
        <div className="rc-desc">{product.description}</div>
        <div className="rc-origin">
          <span className={`dot ${product.dotType}`}></span>
          {product.origin}
        </div>

        {/* Size selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
          {product.sizes.map(s => (
            <div
              key={s.code}
              className={`sr ${product.dotType === 'green' ? 'green-row' : ''} ${selectedSize.code === s.code ? 'sr-selected' : ''}`}
              onClick={() => setSelectedSize(s)}
              style={{
                cursor: 'pointer',
                outline: selectedSize.code === s.code ? '2px solid var(--saffron)' : 'none',
                borderRadius: '6px',
              }}
            >
              <div>
                <div className="sr-lbl">{s.size}</div>
                <div className="sr-cod">{s.code}</div>
              </div>
              <div className={`sr-price ${product.dotType === 'green' ? 'green-price' : ''}`}>
                ₹{s.price}
              </div>
            </div>
          ))}
        </div>

        {/* Quantity + Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          {/* Qty stepper */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0',
            border: '1px solid rgba(59,13,13,0.18)', borderRadius: '8px', overflow: 'hidden',
          }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: '34px', height: '38px', background: 'var(--card)',
                border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                color: 'var(--burg)', fontWeight: 600,
              }}
            >−</button>
            <span style={{
              minWidth: '28px', textAlign: 'center', fontSize: '0.9rem',
              fontWeight: 600, color: 'var(--t)', background: 'var(--bg)',
              padding: '0 4px', lineHeight: '38px',
            }}>{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              style={{
                width: '34px', height: '38px', background: 'var(--card)',
                border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                color: 'var(--burg)', fontWeight: 600,
              }}
            >+</button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', textAlign: 'center' }}
          >
            Add to Cart · ₹{selectedSize.price * qty}
          </button>
        </div>
      </div>
    </div>
  );
}
