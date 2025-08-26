import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Voir nos produits
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-8 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <Link to="/products" className="hover:text-primary transition-colors">
              Tous nos produits
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              À propos de nous
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
