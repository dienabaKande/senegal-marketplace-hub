import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutForm from '@/components/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cart, navigate]);

  const handleOrderSuccess = (orderId: string) => {
    navigate(`/order-success/${orderId}`);
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Finaliser ma commande</h1>
          </div>
          <p className="text-muted-foreground">
            Remplissez vos informations pour finaliser votre commande
          </p>
        </div>

        <CheckoutForm 
          cart={cart}
          total={getCartTotal()}
          onSuccess={handleOrderSuccess}
        />
      </div>
    </div>
  );
};

export default Checkout;