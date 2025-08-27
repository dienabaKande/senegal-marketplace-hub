import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get authenticated user
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

    const { cart, shippingAddress, paymentMethod, notes } = await req.json();

    if (!cart || !cart.length) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Calculate total
    const total = cart.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    // Use service role key to bypass RLS for order creation
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create order
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: notes || '',
        status: 'pending',
        payment_status: paymentMethod === 'delivery' ? 'pending' : 'processing'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create order items
    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabaseService
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Rollback order if items creation fails
      await supabaseService.from('orders').delete().eq('id', order.id);
      return new Response(JSON.stringify({ error: 'Failed to create order items' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`Order created successfully: ${order.id}, Payment method: ${paymentMethod}`);

    return new Response(JSON.stringify({ 
      success: true, 
      orderId: order.id,
      total,
      paymentMethod,
      message: paymentMethod === 'delivery' 
        ? 'Commande créée avec succès. Paiement à la livraison.'
        : `Commande créée avec succès. Procédez au paiement via ${paymentMethod}.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});