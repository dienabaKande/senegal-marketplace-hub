import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes passionnés par l\'artisanat sénégalais et nous nous engageons à promouvoir sa beauté unique.'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Nous travaillons directement avec les artisans locaux pour créer des partenariats durables et équitables.'
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Chaque produit est soigneusement sélectionné pour garantir l\'excellence et l\'authenticité.'
    },
    {
      icon: Globe,
      title: 'Rayonnement',
      description: 'Nous faisons rayonner la culture sénégalaise à travers le monde en préservant les traditions.'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SénégalShop est né de la passion de faire découvrir au monde la richesse 
            de l'artisanat sénégalais. Depuis 2020, nous connectons les artisans 
            talentueux du Sénégal avec des clients du monde entier.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nous croyons que l'artisanat sénégalais mérite d'être célébré et partagé. 
                  Notre mission est de créer un pont entre les traditions millénaires 
                  du Sénégal et les amateurs d'art authentique partout dans le monde.
                </p>
                <p>
                  En travaillant directement avec les artisans, nous garantissons 
                  non seulement l'authenticité de nos produits, mais aussi un 
                  commerce équitable qui profite directement aux créateurs.
                </p>
                <p>
                  Chaque achat sur SénégalShop contribue à préserver les savoir-faire 
                  traditionnels et à soutenir l'économie locale sénégalaise.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Produits uniques</div>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-secondary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Artisans partenaires</div>
              </div>
              <div className="bg-accent/10 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Clients satisfaits</div>
              </div>
              <div className="bg-success/10 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-success mb-2">15</div>
                <div className="text-sm text-muted-foreground">Régions du Sénégal</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={index}
                  className="text-center hover:shadow-senegal transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
            <p className="text-xl text-muted-foreground">
              Des passionnés au service de l'excellence
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Aminata Diallo',
                role: 'Fondatrice & Directrice',
                description: 'Passionnée par l\'artisanat sénégalais depuis son enfance à Dakar.'
              },
              {
                name: 'Mamadou Seck',
                role: 'Responsable Artisans',
                description: 'Coordonne les relations avec nos artisans partenaires dans tout le Sénégal.'
              },
              {
                name: 'Fatou Ba',
                role: 'Responsable Qualité',
                description: 'Veille à ce que chaque produit respecte nos standards d\'excellence.'
              }
            ].map((member, index) => (
              <Card 
                key={index}
                className="text-center hover:shadow-senegal transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-senegal rounded-full"></div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-senegal text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez Notre Aventure
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Découvrez l'authenticité sénégalaise et soutenez les artisans locaux 
            en choisissant nos produits uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/products">
                Découvrir nos produits
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;