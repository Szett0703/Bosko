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
