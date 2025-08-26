import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Plateau, Dakar', 'Sénégal']
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+221 33 123 45 67', '+221 77 123 45 67']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@senegalshop.com', 'support@senegalshop.com']
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven: 8h - 18h', 'Sam: 9h - 15h']
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-Nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question ? Un projet ? N'hésitez pas à nous contacter. 
            Notre équipe vous répondra rapidement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="hover:shadow-senegal transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">{info.title}</h3>
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <Card className="bg-gradient-senegal text-white">
              <CardHeader>
                <CardTitle>Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Livraison</h4>
                  <p className="text-sm opacity-90">
                    Nous livrons partout au Sénégal. Délai de 24-48h pour Dakar, 
                    2-5 jours pour les autres régions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Paiement</h4>
                  <p className="text-sm opacity-90">
                    Paiement sécurisé par carte bancaire, Orange Money, 
                    ou Wave Money.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Retours</h4>
                  <p className="text-sm opacity-90">
                    Retours acceptés dans les 14 jours suivant la réception, 
                    produits en état neuf.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-20">
          <Card>
            <CardHeader>
              <CardTitle>Notre Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Plateau, Dakar - Sénégal</p>
                  <p className="text-muted-foreground">Carte interactive bientôt disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contact;