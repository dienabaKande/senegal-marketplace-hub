import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Navigation': [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ],
    'Catégories': [
      { label: 'Tissus Wax', href: '/products?category=tissus' },
      { label: 'Artisanat', href: '/products?category=artisanat' },
      { label: 'Épices', href: '/products?category=epices' },
      { label: 'Bijoux', href: '/products?category=bijoux' }
    ],
    'Support': [
      { label: 'FAQ', href: '/faq' },
      { label: 'Livraison', href: '/livraison' },
      { label: 'Retours', href: '/retours' },
      { label: 'Paiement', href: '/paiement' }
    ]
  };

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SN</span>
              </div>
              <span className="font-bold text-xl">SénégalShop</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Découvrez l'authenticité sénégalaise à travers notre collection 
              unique d'artisanat traditionnel et de produits de qualité.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-lg mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Newsletter</h3>
              <p className="text-muted-foreground">
                Restez informé de nos nouveautés et offres spéciales
              </p>
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Votre adresse email" 
                type="email"
                className="flex-1"
              />
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8">
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+221 33 123 45 67</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>contact@senegalshop.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Plateau, Dakar - Sénégal</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 SénégalShop. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Conditions
            </Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;