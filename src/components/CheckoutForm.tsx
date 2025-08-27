import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, Smartphone, Truck } from 'lucide-react';
import { CartItem } from '@/types/product';

interface CheckoutFormProps {
  cart: CartItem[];
  total: number;
  onSuccess: (orderId: string) => void;
}

const CheckoutForm = ({ cart, total, onSuccess }: CheckoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('delivery');
  const { toast } = useToast();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    region: '',
    postalCode: ''
  });

  const [notes, setNotes] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'phone', 'email', 'address', 'city'];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast({
          title: "Erreur",
          description: `Le champ ${field} est requis.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          cart,
          shippingAddress: shippingInfo,
          paymentMethod,
          notes
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Commande créée avec succès !",
          description: data.message,
        });
        onSuccess(data.orderId);
      } else {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur lors de la commande",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    {
      id: 'wave',
      label: 'Wave',
      icon: Smartphone,
      description: 'Paiement mobile via Wave'
    },
    {
      id: 'orange',
      label: 'Orange Money',
      icon: CreditCard,
      description: 'Paiement mobile via Orange Money'
    },
    {
      id: 'delivery',
      label: 'Paiement à la livraison',
      icon: Truck,
      description: 'Payez en espèces à la réception'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={shippingInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={shippingInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 77 XXX XX XX"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={shippingInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse complète *</Label>
            <Textarea
              id="address"
              value={shippingInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Numéro, rue, quartier..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Dakar, Thiès..."
                required
              />
            </div>
            <div>
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                value={shippingInfo.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Dakar, Thiès..."
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes de commande (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions spéciales, préférences de livraison..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Méthode de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            {paymentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirmer la commande
      </Button>
    </form>
  );
};

export default CheckoutForm;