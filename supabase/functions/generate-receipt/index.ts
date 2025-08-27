import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { orderId } = await req.json();

    // Fetch order details with items
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (name, description)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    // Create QR Code data (order verification URL)
    const qrData = `https://ndiougueshop.com/verify-order/${orderId}`;
    
    // Generate receipt HTML
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de commande - NdiongueShop</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
        .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #eee; padding: 30px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #d4af37; margin-bottom: 10px; }
        .company-info { color: #666; font-size: 14px; }
        .order-info { margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .info-label { font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background: #f5f5f5; font-weight: bold; }
        .total-section { border-top: 2px solid #333; padding-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total-final { font-size: 18px; font-weight: bold; color: #d4af37; }
        .qr-section { text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">NdiongueShop</div>
            <div class="company-info">
                Keur Massar, Dakar - Sénégal<br>
                Tél: +221 77 857 72 06<br>
                Email: contact@ndiougueshop.com
            </div>
        </div>

        <div class="order-info">
            <div class="info-row">
                <span class="info-label">N° de commande:</span>
                <span>${order.id}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span>${new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Client:</span>
                <span>${profile?.first_name || ''} ${profile?.last_name || ''}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Méthode de paiement:</span>
                <span>${order.payment_method === 'wave' ? 'Wave' : 
                         order.payment_method === 'orange' ? 'Orange Money' : 
                         'Paiement à la livraison'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Statut:</span>
                <span>${order.status === 'pending' ? 'En attente' : 
                         order.status === 'confirmed' ? 'Confirmée' : 
                         order.status === 'delivered' ? 'Livrée' : order.status}</span>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.order_items.map((item: any) => `
                <tr>
                    <td>${item.products.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString('fr-FR')} FCFA</td>
                    <td>${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>${order.total.toLocaleString('fr-FR')} FCFA</span>
            </div>
        </div>

        <div class="qr-section">
            <p><strong>Code QR de vérification:</strong></p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}" alt="QR Code" />
            <p style="font-size: 12px; color: #666;">Scannez ce code pour vérifier l'authenticité de ce reçu</p>
        </div>

        <div class="footer">
            <p>Merci de votre confiance !</p>
            <p>NdiongueShop - Votre boutique sénégalaise de confiance</p>
        </div>
    </div>
</body>
</html>`;

    return new Response(JSON.stringify({ 
      success: true, 
      receiptHTML,
      orderId: order.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});