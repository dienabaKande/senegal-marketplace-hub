import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'tissus': 'Tissus',
      'artisanat': 'Artisanat',
      'epices': 'Épices',
      'bijoux': 'Bijoux'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'tissus': 'bg-primary text-primary-foreground',
      'artisanat': 'bg-secondary text-secondary-foreground',
      'epices': 'bg-accent text-accent-foreground',
      'bijoux': 'bg-warning text-warning-foreground'
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="group hover:shadow-senegal transition-all duration-300 animate-fade-in-up">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              Vedette
            </Badge>
          )}
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
            <span className={`text-xs ${product.stock > 0 ? 'text-success' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/product/${product.id}`}>
            Voir détails
          </Link>
        </Button>
        <Button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;