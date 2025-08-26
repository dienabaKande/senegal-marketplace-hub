import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Share2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { getProductById, products } = useProducts();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
      setLoading(false);
    };

    fetchProduct();
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Ajouté au panier",
      description: `${quantity} x ${product.name} ajouté${quantity > 1 ? 's' : ''} à votre panier`,
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

  const categoryName = product.category?.name || 'Produit';

  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Produits</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Back Button */}
        <Button asChild variant="outline" className="mb-8">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">
                  {getCategoryLabel(categoryName)}
                </Badge>
                {product.featured && (
                  <Badge className="bg-accent text-accent-foreground">
                    Produit vedette
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="text-3xl font-bold text-primary mb-6">
                {product.price.toLocaleString('fr-FR')} FCFA
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-destructive'}`}></div>
              <span className={`font-medium ${product.stock > 0 ? 'text-success' : 'text-destructive'}`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantité</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Détails du produit</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catégorie :</span>
                    <span>{getCategoryLabel(categoryName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disponibilité :</span>
                    <span>{product.stock > 0 ? 'En stock' : 'Rupture de stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origine :</span>
                    <span>Sénégal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-senegal transition-all duration-300">
                  <CardContent className="p-0">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProduct.image_url || '/placeholder.svg'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          {relatedProduct.price.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;