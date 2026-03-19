import { db } from '@/db';
import { products, categories, productImages } from '@/db/schema';
import { getSiteSettings } from '@/lib/settings';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, allProducts, allCategories] = await Promise.all([
    getSiteSettings(),
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        mrp: products.mrp,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt)),
    db.select().from(categories).orderBy(categories.name),
  ]);

  const allImages =
    allProducts.length > 0
      ? await db.select().from(productImages).where(eq(productImages.position, 0))
      : [];

  const imageMap = new Map(allImages.map((img) => [img.productId, img.url]));

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />

      <main>
        {/* Hero */}
        <section className="hero-section" aria-label="Hero">
          <div className="hero-inner">
            <div className="hero-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#4f7fff" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              India&apos;s Trusted Hearing Care Store
            </div>
            <h1 className="hero-title">
              Hear the World<br />
              <span className="hero-title-accent">Clearer Than Ever</span>
            </h1>
            <p className="hero-desc">
              Premium hearing aids from the world&apos;s leading brands — Signia, Phonak, Oticon &amp; more.
              Expert guidance for every lifestyle and hearing need.
            </p>
            <div className="hero-ctas">
              <a href="#products" className="hero-btn-primary">Explore Products</a>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="hero-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                  Call Us
                </a>
              )}
            </div>
            <div className="hero-trust">
              <div className="trust-item"><span className="trust-check">✓</span> Free Consultation</div>
              <div className="trust-item"><span className="trust-check">✓</span> Authorised Dealer</div>
              <div className="trust-item"><span className="trust-check">✓</span> Trial Available</div>
              <div className="trust-item"><span className="trust-check">✓</span> Expert Support</div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="products-section" id="products" aria-label="Products">
          <div className="products-inner">
            <div className="section-header">
              <div>
                <h2 className="section-title">Our Hearing Aids</h2>
                <p className="section-sub">Browse our complete range of premium devices</p>
              </div>
              <span className="product-count">{allProducts.length} products</span>
            </div>

            {allCategories.length > 0 && (
              <nav className="filter-bar" aria-label="Category filters">
                <Link href="/" className="filter-btn active">All</Link>
                {allCategories.map((cat) => (
                  <Link href={`/?category=${cat.slug}`} key={cat.id} className="filter-btn">
                    {cat.name}
                  </Link>
                ))}
              </nav>
            )}

            {allProducts.length === 0 ? (
              <div className="empty-products">
                <div className="empty-icon" aria-hidden="true">🎧</div>
                <h3>No products yet</h3>
                <p>Check back soon — we&apos;re adding products!</p>
              </div>
            ) : (
              <div className="products-grid">
                {allProducts.map((product) => {
                  const imageUrl = imageMap.get(product.id);
                  return (
                    <Link key={product.id} href={`/products/${product.slug}`} className="product-card">
                      <div className="product-card-img-wrap">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="product-card-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="product-card-placeholder" aria-hidden="true">🎧</div>
                        )}
                      </div>
                      <div className="product-card-body">
                        {product.categoryName && (
                          <div className="product-card-category">{product.categoryName}</div>
                        )}
                        <h3 className="product-card-title">{product.title}</h3>
                        <div className="product-card-footer">
                          <div>
                            <span className="product-card-price">
                              ₹{parseFloat(product.mrp).toLocaleString('en-IN')}
                            </span>
                            <span className="product-card-mrp-tag"> MRP</span>
                          </div>
                          <span className="product-card-cta">View →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why Us */}
        <section className="why-section" id="why" aria-label="Why choose us">
          <div className="why-inner">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Why Choose Us?</h2>
            <p className="section-sub" style={{ textAlign: 'center', marginBottom: 48 }}>
              We&apos;re committed to finding the right solution for your hearing needs
            </p>
            <div className="why-grid">
              {[
                { icon: '🏆', title: 'Authorised Dealer', desc: 'Official dealer for all leading hearing aid brands in India.' },
                { icon: '👨‍⚕️', title: 'Expert Audiologists', desc: 'Our trained specialists guide you to the perfect device.' },
                { icon: '🔬', title: 'Free Trial', desc: 'Try before you buy with our hassle-free demo program.' },
                { icon: '🛡️', title: 'Warranty & Support', desc: 'Full manufacturer warranty with ongoing after-sales care.' },
              ].map((item) => (
                <div key={item.title} className="why-card">
                  <div className="why-icon" aria-hidden="true">{item.icon}</div>
                  <h3 className="why-title">{item.title}</h3>
                  <p className="why-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        {(settings.phone || settings.email) && (
          <section className="cta-banner" aria-label="Contact us">
            <div className="cta-inner">
              <h2 className="cta-title">Need Help Choosing?</h2>
              <p className="cta-desc">Our hearing care experts are ready to help you find the perfect device.</p>
              <div className="cta-btns">
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="cta-btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                    {settings.phone}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="cta-btn-secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    {settings.email}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="pub-footer" aria-label="Site footer">
        <div className="pub-footer-inner">
          <div className="footer-brand">
            {settings.brandLogoUrl ? (
              <img src={settings.brandLogoUrl} alt={settings.brandName} className="footer-logo" />
            ) : (
              <div className="footer-brand-name">
                <span aria-hidden="true">🎧</span> {settings.brandName}
              </div>
            )}
            <p className="footer-tagline">Your trusted partner for better hearing.</p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <Link href="/#products" className="footer-link">Products</Link>
              <Link href="/#why" className="footer-link">Why Us</Link>
            </div>
            {(settings.phone || settings.email) && (
              <div className="footer-col">
                <h4 className="footer-col-title">Contact</h4>
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="footer-link">{settings.phone}</a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="footer-link">{settings.email}</a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating call button */}
      {settings.phone && (
        <a href={`tel:${settings.phone}`} className="fab-call" aria-label={`Call ${settings.phone}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </a>
      )}
    </>
  );
}
