import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Produit retiré",
      description: `${productName} a été retiré de votre panier`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Panier vidé",
      description: "Tous les produits ont été retirés de votre panier",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Découvrez nos magnifiques produits sénégalais et ajoutez-les à votre panier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/products">
                  Découvrir nos produits
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mon Panier</h1>
          <Button variant="outline" onClick={handleClearCart}>
            <Trash2 className="mr-2 h-4 w-4" />
            Vider le panier
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-semibold text-lg hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.product.price.toLocaleString('fr-FR')} FCFA / unité
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-success">Gratuite</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{getCartTotal().toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    Procéder au paiement
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">
                    Continuer mes achats
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;