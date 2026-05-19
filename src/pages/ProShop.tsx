import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

type Category = 'All' | 'Rackets' | 'Shoes' | 'Apparel' | 'Accessories';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Exclude<Category, 'All'>;
  price: number;
  rating: number;
  badge?: 'NEW' | 'SALE' | 'PRO';
  image: string;
}

const categories: Category[] = ['All', 'Rackets', 'Shoes', 'Apparel', 'Accessories'];

const products: Product[] = [
  {
    id: 'p1',
    name: 'Arc Saber 11 Pro',
    brand: 'Yonex',
    category: 'Rackets',
    price: 219,
    rating: 4.8,
    badge: 'PRO',
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'p2',
    name: 'Aerus X Court Shoe',
    brand: 'Victor',
    category: 'Shoes',
    price: 138,
    rating: 4.6,
    badge: 'NEW',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'p3',
    name: 'Pro Tour Tee',
    brand: 'AcePoint',
    category: 'Apparel',
    price: 32,
    rating: 4.4,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'p4',
    name: 'Feather Shuttle Tube',
    brand: 'AcePoint',
    category: 'Accessories',
    price: 24,
    rating: 4.9,
    badge: 'SALE',
    image:
      'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'p5',
    name: 'Grip Tape Pack (6)',
    brand: 'Li-Ning',
    category: 'Accessories',
    price: 12,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'p6',
    name: 'Court Shorts',
    brand: 'AcePoint',
    category: 'Apparel',
    price: 38,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=70',
  },
];

export function ProShop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCategory = activeCategory === 'All' || p.category === activeCategory;
      const matches =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return inCategory && matches;
    });
  }, [activeCategory, query]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price ?? 0) * qty;
  }, 0);

  const add = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  return (
    <div className="min-h-dvh bg-surface pb-36 text-on-surface">
      <PageHeader
        subtitle="Pro Shop"
        title="Gear Up"
        trailing={{ icon: 'favorite', label: 'wishlist', onClick: () => {} }}
      />

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section>
          <label className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-sm shadow-elevated focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Icon name="search" className="text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rackets, shoes, gear…"
              className="w-full bg-transparent font-body text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="clear">
                <Icon name="close" className="text-on-surface-variant" />
              </button>
            )}
          </label>
        </section>

        <section className="-mx-container-padding">
          <div className="hide-scrollbar flex gap-sm overflow-x-auto px-container-padding">
            {categories.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`flex-shrink-0 rounded-full px-md py-xs font-label text-label-lg transition active:scale-95 ${
                    active
                      ? 'bg-primary text-on-primary shadow-elevated'
                      : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-sm flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-primary">Featured</h2>
            <span className="font-label text-label-sm text-on-surface-variant">
              {filtered.length} items
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-sm rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-xl text-center">
              <Icon name="storefront" className="text-3xl text-outline" />
              <p className="font-headline text-headline-md text-primary">No matches</p>
              <p className="font-body text-body-md text-on-surface-variant">
                Try a different category or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-gutter">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={cart[p.id] ?? 0}
                  onAdd={() => add(p.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-screen-sm rounded-t-xl border-t border-outline-variant/10 bg-surface p-md shadow-elevated-top">
        <div className="flex items-center gap-md">
          <div className="flex-1">
            <p className="font-label text-label-sm text-outline">
              {cartCount} item{cartCount === 1 ? '' : 's'} in cart
            </p>
            <p className="font-headline text-headline-md leading-tight text-primary">
              ${cartTotal.toFixed(2)}
            </p>
          </div>
          <button
            disabled={cartCount === 0}
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-sm rounded-xl bg-secondary-fixed px-xl py-md font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition-all hover:bg-secondary-fixed-dim active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            <Icon name="shopping_bag" />
            <span>Checkout</span>
          </button>
        </div>
      </div>

      <BottomNav active="Explore" />
    </div>
  );
}

function ProductCard({
  product,
  qty,
  onAdd,
}: {
  product: Product;
  qty: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-elevated transition active:scale-[0.99]">
      <div className="relative aspect-square w-full bg-surface-container">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {product.badge && (
          <span
            className={`absolute left-sm top-sm rounded-full px-2 py-0.5 font-label text-label-sm font-bold ${
              product.badge === 'SALE'
                ? 'bg-error text-on-error'
                : product.badge === 'PRO'
                  ? 'bg-primary text-on-primary'
                  : 'bg-secondary-fixed text-on-secondary-fixed'
            }`}
          >
            {product.badge}
          </span>
        )}
        {qty > 0 && (
          <span className="absolute right-sm top-sm flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 font-label text-label-sm font-bold text-on-primary">
            {qty}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-xs p-md">
        <p className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
          {product.brand}
        </p>
        <p className="line-clamp-2 font-headline text-headline-md leading-tight text-primary">
          {product.name}
        </p>
        <div className="flex items-center gap-xs">
          <Icon name="star" filled className="text-base text-secondary-fixed-dim" />
          <span className="font-label text-label-sm text-on-surface-variant">
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-sm">
          <span className="font-headline text-headline-md text-primary">${product.price}</span>
          <button
            onClick={onAdd}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-elevated transition active:scale-90"
            aria-label="add to cart"
          >
            <Icon name="add" />
          </button>
        </div>
      </div>
    </div>
  );
}
