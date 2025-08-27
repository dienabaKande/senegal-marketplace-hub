import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const Home = () => {
  const featuredProducts = products.filter(product => product.featured);

  const features = [
    {
      icon: Star,
      title: 'Produits Authentiques',
      description: 'Directement du Sénégal, garantis 100% authentiques'
    },
    {
      icon: Shield,
      title: 'Qualité Premium',
      description: 'Sélection rigoureuse par nos artisans partenaires'
    },
    {
      icon: Truck,
      title: 'Livraison Rapide',
      description: 'Livraison partout au Sénégal en 24-48h'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/60 to-accent/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Découvrez le
            <span className="block gradient-gold bg-clip-text text-transparent">
              Sénégal Authentique
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Tissus wax, artisanat traditionnel, épices parfumées et bijoux uniques.
            L'excellence sénégalaise livrée chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/products">
                Découvrir nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/20 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/about">
                Notre histoire
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir NdiongueShop ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous nous engageons à vous offrir le meilleur de l'artisanat sénégalais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-8 rounded-lg bg-card shadow-sm hover:shadow-senegal transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Produits Vedettes</h2>
            <p className="text-xl text-muted-foreground">
              Nos créations les plus populaires, sélectionnées avec soin
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/products">
                Voir tous nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-senegal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à découvrir l'authenticité sénégalaise ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits qui font confiance à NdiongueShop
            pour leurs achats d'artisanat authentique.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/products">
              Commencer mes achats
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;