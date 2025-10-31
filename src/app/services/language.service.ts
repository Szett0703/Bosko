import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

interface Translations {
  // Header
  headerNav: {
    home: string;
    collections: string;
    about: string;
    contact: string;
  };

  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  // Collections Page
  collections: {
    pageTitle: string;
    pageSubtitle: string;
    viewCollection: string;
    closeCollection: string;
    menCollection: {
      name: string;
      description: string;
    };
    womenCollection: {
      name: string;
      description: string;
    };
    kidsCollection: {
      name: string;
      description: string;
    };
    accessoriesCollection: {
      name: string;
      description: string;
    };
    footwearCollection: {
      name: string;
      description: string;
    };
    saleCollection: {
      name: string;
      description: string;
    };
  };

  // Sidebar
  sidebar: {
    categories: {
      men: string;
      women: string;
      kids: string;
      accessories: string;
      footwear: string;
      sale: string;
    };
    promoBanner: {
      title: string;
      subtitle: string;
    };
  };

  // Footer
  footer: {
    brandTagline: string;
    quickLinks: {
      title: string;
      about: string;
      shipping: string;
      returns: string;
      faq: string;
    };
    contact: {
      title: string;
      phone: string;
      email: string;
      hours: string;
    };
    followUs: string;
  };

  // Product Card
  product: {
    addToCart: string;
  };

  // Cart Page
  cart: {
    pageTitle: string;
    emptyCart: string;
    emptyCartMessage: string;
    continueShopping: string;
    product: string;
    price: string;
    quantity: string;
    total: string;
    subtotal: string;
    tax: string;
    orderTotal: string;
    clearCart: string;
    checkout: string;
    remove: string;
  };

  // About Page
  about: {
    pageTitle: string;
    mission: {
      title: string;
      content: string;
    };
    story: {
      title: string;
      content: string;
    };
    values: {
      title: string;
      quality: string;
      qualityDesc: string;
      sustainability: string;
      sustainabilityDesc: string;
      innovation: string;
      innovationDesc: string;
    };
  };

  // Contact Page
  contact: {
    pageTitle: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      sending: string;
      success: string;
    };
    info: {
      title: string;
      address: string;
      phone: string;
      email: string;
      hours: string;
    };
  };

  // Profile Page
  profile: {
    pageTitle: string;
    personalInfo: {
      title: string;
      name: string;
      email: string;
      phone: string;
      save: string;
    };
    orderHistory: {
      title: string;
      noOrders: string;
      orderNumber: string;
      date: string;
      total: string;
      status: string;
    };
    preferences: {
      title: string;
      language: string;
      notifications: string;
      newsletter: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal<Language>('es');

  private translations: Record<Language, Translations> = {
    es: {
      headerNav: {
        home: 'Inicio',
        collections: 'Colecciones',
        about: 'Nosotros',
        contact: 'Contacto'
      },
      hero: {
        badge: '🔥 NUEVA TEMPORADA',
        title: '¡Descubre Tu Estilo Perfecto!',
        subtitle: 'Moda exclusiva que te hace sentir increíble. Calidad premium, diseños únicos y precios que te sorprenderán. ¡Renueva tu armario hoy!',
        ctaPrimary: '¡Quiero Comprar Ahora!',
        ctaSecondary: 'Ver Ofertas Especiales'
      },
      collections: {
        pageTitle: 'Nuestras Colecciones',
        pageSubtitle: 'Explora nuestras colecciones exclusivas y encuentra el estilo perfecto para ti',
        viewCollection: 'Ver Colección',
        closeCollection: 'Cerrar Colección',
        menCollection: {
          name: 'Colección Hombres',
          description: '¡Luce impecable con nuestro estilo masculino único! Diseños modernos que marcan tendencia.'
        },
        womenCollection: {
          name: 'Colección Mujeres',
          description: '¡Brilla con elegancia! Piezas exclusivas que realzan tu belleza y personalidad.'
        },
        kidsCollection: {
          name: 'Colección Niños',
          description: '¡Diversión y comodidad para los pequeños! Ropa duradera que los niños aman.'
        },
        accessoriesCollection: {
          name: 'Accesorios',
          description: '¡El toque perfecto! Complementos que transforman cualquier outfit en extraordinario.'
        },
        footwearCollection: {
          name: 'Calzado',
          description: '¡Cada paso con estilo! Zapatos de calidad premium que combinan confort y diseño.'
        },
        saleCollection: {
          name: 'Ofertas Especiales',
          description: '¡Increíbles descuentos! Aprovecha nuestras mejores ofertas antes de que se acaben.'
        }
      },
      sidebar: {
        categories: {
          men: 'Hombres',
          women: 'Mujeres',
          kids: 'Niños',
          accessories: 'Accesorios',
          footwear: 'Calzado',
          sale: '🔥 Ofertas'
        },
        promoBanner: {
          title: '¡ENVÍO GRATIS!',
          subtitle: 'En compras +$50'
        }
      },
      footer: {
        brandTagline: 'Estilo que te define. Calidad que perdura.',
        quickLinks: {
          title: 'Enlaces Rápidos',
          about: 'Sobre Nosotros',
          shipping: 'Envíos',
          returns: 'Devoluciones',
          faq: 'Preguntas Frecuentes'
        },
        contact: {
          title: 'Contáctanos',
          phone: '+1 (555) 123-4567',
          email: 'hola@bosko.com',
          hours: 'Lun - Vie: 9AM - 6PM'
        },
        followUs: 'Síguenos'
      },
      product: {
        addToCart: '¡Lo Quiero!'
      },
      cart: {
        pageTitle: 'Mi Carrito de Compras',
        emptyCart: 'Tu carrito está vacío',
        emptyCartMessage: 'Parece que aún no has agregado productos. ¡Empieza a comprar ahora!',
        continueShopping: 'Continuar Comprando',
        product: 'Producto',
        price: 'Precio',
        quantity: 'Cantidad',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Impuestos (10%)',
        orderTotal: 'Total del Pedido',
        clearCart: 'Vaciar Carrito',
        checkout: 'Proceder al Pago',
        remove: 'Eliminar'
      },
      about: {
        pageTitle: 'Sobre Nosotros',
        mission: {
          title: 'Nuestra Misión',
          content: 'En Bosko, nos dedicamos a crear moda que no solo se ve bien, sino que también te hace sentir increíble. Creemos que la ropa es una forma de expresión personal y estamos comprometidos a ofrecerte piezas únicas que reflejen tu personalidad.'
        },
        story: {
          title: 'Nuestra Historia',
          content: 'Fundada en 2020, Bosko nació de la pasión por el diseño y la calidad. Comenzamos como una pequeña boutique y hemos crecido hasta convertirnos en una marca reconocida por su compromiso con la excelencia y la innovación en moda.'
        },
        values: {
          title: 'Nuestros Valores',
          quality: 'Calidad Premium',
          qualityDesc: 'Utilizamos solo los mejores materiales y técnicas de confección para garantizar que cada prenda dure años.',
          sustainability: 'Sostenibilidad',
          sustainabilityDesc: 'Nos comprometemos con prácticas éticas y sostenibles en toda nuestra cadena de producción.',
          innovation: 'Innovación',
          innovationDesc: 'Constantemente buscamos nuevas formas de mejorar nuestros diseños y procesos.'
        }
      },
      contact: {
        pageTitle: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.',
        form: {
          name: 'Nombre Completo',
          email: 'Correo Electrónico',
          subject: 'Asunto',
          message: 'Mensaje',
          send: 'Enviar Mensaje',
          sending: 'Enviando...',
          success: '¡Mensaje enviado exitosamente!'
        },
        info: {
          title: 'Información de Contacto',
          address: '123 Calle Principal, Ciudad, País',
          phone: '+1 (555) 123-4567',
          email: 'hola@bosko.com',
          hours: 'Lunes - Viernes: 9AM - 6PM'
        }
      },
      profile: {
        pageTitle: 'Mi Perfil',
        personalInfo: {
          title: 'Información Personal',
          name: 'Nombre',
          email: 'Correo Electrónico',
          phone: 'Teléfono',
          save: 'Guardar Cambios'
        },
        orderHistory: {
          title: 'Historial de Pedidos',
          noOrders: 'No tienes pedidos aún',
          orderNumber: 'Pedido #',
          date: 'Fecha',
          total: 'Total',
          status: 'Estado'
        },
        preferences: {
          title: 'Preferencias',
          language: 'Idioma',
          notifications: 'Notificaciones por email',
          newsletter: 'Suscripción al boletín'
        }
      }
    },
    en: {
      headerNav: {
        home: 'Home',
        collections: 'Collections',
        about: 'About',
        contact: 'Contact'
      },
      hero: {
        badge: '🔥 NEW SEASON',
        title: 'Discover Your Perfect Style!',
        subtitle: 'Exclusive fashion that makes you feel amazing. Premium quality, unique designs, and prices that will surprise you. Refresh your wardrobe today!',
        ctaPrimary: 'Shop Now!',
        ctaSecondary: 'View Special Offers'
      },
      collections: {
        pageTitle: 'Our Collections',
        pageSubtitle: 'Explore our exclusive collections and find the perfect style for you',
        viewCollection: 'View Collection',
        closeCollection: 'Close Collection',
        menCollection: {
          name: "Men's Collection",
          description: 'Look impeccable with our unique masculine style! Modern designs that set trends.'
        },
        womenCollection: {
          name: "Women's Collection",
          description: 'Shine with elegance! Exclusive pieces that enhance your beauty and personality.'
        },
        kidsCollection: {
          name: "Kids' Collection",
          description: 'Fun and comfort for the little ones! Durable clothing that kids love.'
        },
        accessoriesCollection: {
          name: 'Accessories',
          description: 'The perfect touch! Complements that transform any outfit into extraordinary.'
        },
        footwearCollection: {
          name: 'Footwear',
          description: 'Every step with style! Premium quality shoes that combine comfort and design.'
        },
        saleCollection: {
          name: 'Special Offers',
          description: 'Amazing discounts! Grab our best deals before they run out.'
        }
      },
      sidebar: {
        categories: {
          men: 'Men',
          women: 'Women',
          kids: 'Kids',
          accessories: 'Accessories',
          footwear: 'Footwear',
          sale: '🔥 Sale'
        },
        promoBanner: {
          title: 'FREE SHIPPING!',
          subtitle: 'Orders over $50'
        }
      },
      footer: {
        brandTagline: 'Style that defines you. Quality that lasts.',
        quickLinks: {
          title: 'Quick Links',
          about: 'About Us',
          shipping: 'Shipping',
          returns: 'Returns',
          faq: 'FAQ'
        },
        contact: {
          title: 'Contact Us',
          phone: '+1 (555) 123-4567',
          email: 'hello@bosko.com',
          hours: 'Mon - Fri: 9AM - 6PM'
        },
        followUs: 'Follow Us'
      },
      product: {
        addToCart: 'Add to Cart'
      },
      cart: {
        pageTitle: 'My Shopping Cart',
        emptyCart: 'Your cart is empty',
        emptyCartMessage: "Looks like you haven't added any products yet. Start shopping now!",
        continueShopping: 'Continue Shopping',
        product: 'Product',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax (10%)',
        orderTotal: 'Order Total',
        clearCart: 'Clear Cart',
        checkout: 'Checkout',
        remove: 'Remove'
      },
      about: {
        pageTitle: 'About Us',
        mission: {
          title: 'Our Mission',
          content: "At Bosko, we're dedicated to creating fashion that not only looks good but also makes you feel amazing. We believe clothing is a form of personal expression, and we're committed to offering unique pieces that reflect your personality."
        },
        story: {
          title: 'Our Story',
          content: 'Founded in 2020, Bosko was born from a passion for design and quality. We started as a small boutique and have grown into a brand recognized for its commitment to excellence and innovation in fashion.'
        },
        values: {
          title: 'Our Values',
          quality: 'Premium Quality',
          qualityDesc: 'We use only the finest materials and craftsmanship techniques to ensure every garment lasts for years.',
          sustainability: 'Sustainability',
          sustainabilityDesc: 'We commit to ethical and sustainable practices throughout our entire production chain.',
          innovation: 'Innovation',
          innovationDesc: 'We constantly seek new ways to improve our designs and processes.'
        }
      },
      contact: {
        pageTitle: 'Contact Us',
        subtitle: "We're here to help. Send us a message and we'll respond soon.",
        form: {
          name: 'Full Name',
          email: 'Email Address',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message',
          sending: 'Sending...',
          success: 'Message sent successfully!'
        },
        info: {
          title: 'Contact Information',
          address: '123 Main Street, City, Country',
          phone: '+1 (555) 123-4567',
          email: 'hello@bosko.com',
          hours: 'Monday - Friday: 9AM - 6PM'
        }
      },
      profile: {
        pageTitle: 'My Profile',
        personalInfo: {
          title: 'Personal Information',
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          save: 'Save Changes'
        },
        orderHistory: {
          title: 'Order History',
          noOrders: "You don't have any orders yet",
          orderNumber: 'Order #',
          date: 'Date',
          total: 'Total',
          status: 'Status'
        },
        preferences: {
          title: 'Preferences',
          language: 'Language',
          notifications: 'Email notifications',
          newsletter: 'Newsletter subscription'
        }
      }
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('bosko-language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      this.currentLanguage.set(savedLang);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage();
  }

  getLanguageSignal() {
    return this.currentLanguage;
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem('bosko-language', lang);
  }

  toggleLanguage() {
    const newLang: Language = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  getTranslations(): Translations {
    return this.translations[this.currentLanguage()];
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage()];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }
}
