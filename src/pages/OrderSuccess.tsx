import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle, Download, Home, FileText, Loader2 } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  const { clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    clearCart();
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (name, description, image_url)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la commande.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = async () => {
    if (!orderId) return;

    setGeneratingReceipt(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-receipt', {
        body: { orderId }
      });

      if (error) throw error;

      if (data.success) {
        // Create a blob from the HTML and download it
        const blob = new Blob([data.receiptHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recu-commande-${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Reçu généré avec succès !",
          description: "Le reçu a été téléchargé sur votre appareil.",
        });
      }
    } catch (error: any) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le reçu. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Commande introuvable</h2>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'wave': return 'Wave';
      case 'orange': return 'Orange Money';
      case 'delivery': return 'Paiement à la livraison';
      default: return method;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre confiance. Votre commande a été reçue et sera traitée rapidement.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Détails de la commande</span>
              <Badge variant="secondary">
                {getStatusLabel(order.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Informations de commande</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">N° de commande:</span> {order.id}</p>
                  <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                  <p><span className="font-medium">Paiement:</span> {getPaymentMethodLabel(order.payment_method)}</p>
                  <p><span className="font-medium">Total:</span> <span className="font-semibold text-primary">{order.total.toLocaleString('fr-FR')} FCFA</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Adresse de livraison</h4>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.region}</p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold mb-4">Articles commandés</h4>
              <div className="space-y-3">
                {order.order_items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <img 
                      src={item.products.image_url || '/placeholder.svg'} 
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.products.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.quantity * item.price).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={generateReceipt}
            disabled={generatingReceipt}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            {generatingReceipt && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" />
            Télécharger le reçu
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <Link to="/products">
              <FileText className="mr-2 h-4 w-4" />
              Continuer mes achats
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="ghost" 
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Payment Instructions */}
        {order.payment_method !== 'delivery' && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 text-primary">Instructions de paiement</h4>
              {order.payment_method === 'wave' && (
                <div className="text-sm space-y-2">
                  <p>• Ouvrez votre application Wave</p>
                  <p>• Effectuez un transfert vers le numéro : <strong>+221 77 857 72 06</strong></p>
                  <p>• Montant : <strong>{order.total.toLocaleString('fr-FR')} FCFA</strong></p>
                  <p>• Référence : <strong>{order.id}</strong></p>
                  <p className="text-muted-foreground mt-3">Votre commande sera confirmée après réception du paiement.</p>
                </div>
              )}
              {order.payment_method === 'orange' && (
                <div className="text-sm space-y-2">
                  <p>• Composez *144# depuis votre téléphone Orange</p>
                  <p>• Sélectionnez "Transfert d'argent"</p>
                  <p>• Numéro destinataire : <strong>+221 77 857 72 06</strong></p>
                  <p>• Montant : <strong>{order.total.toLocaleString('fr-FR')} FCFA</strong></p>
                  <p>• Référence : <strong>{order.id}</strong></p>
                  <p className="text-muted-foreground mt-3">Votre commande sera confirmée après réception du paiement.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;