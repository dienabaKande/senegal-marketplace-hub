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

  const getCategoryLabel = (categoryName: string): string => {
    const labels: { [key: string]: string } = {
      'tissus': 'Tissus',
      'tissu': 'Tissu',
      'artisanat': 'Artisanat',
      'epices': 'Épices',
      'épices': 'Épices',
      'bijoux': 'Bijoux',
      'hommes': 'Hommes',
      'femmes': 'Femmes',
      'enfants': 'Enfants'
    };
    return labels[categoryName.toLowerCase()] || categoryName;
  };

  const getCategoryColor = (categoryName: string): string => {
    switch (categoryName.toLowerCase()) {
      case 'tissus':
      case 'tissu':
        return 'bg-primary/10 text-primary';
      case 'artisanat':
        return 'bg-secondary/10 text-secondary-foreground';
      case 'epices':
      case 'épices':
        return 'bg-accent/10 text-accent-foreground';
      case 'bijoux':
        return 'bg-primary/20 text-primary';
      case 'hommes':
        return 'bg-blue-100 text-blue-800';
      case 'femmes':
        return 'bg-pink-100 text-pink-800';
      case 'enfants':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryName = product.category?.name || 'Produit';

  return (
    <Card className="group hover:shadow-senegal transition-all duration-300 animate-fade-in-up">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              Vedette
            </Badge>
          )}
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(categoryName)}`}>
            {getCategoryLabel(categoryName)}
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