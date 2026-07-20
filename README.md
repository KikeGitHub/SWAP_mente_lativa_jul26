# Mente Lativa - Identity-Led Storytelling Studio

Este es el proyecto web estático premium para **Mente Lativa**, diseñado como un portal de agencia creativa global con animaciones fluidas, adaptabilidad móvil total e intro integrada con control de audio.

---

## 📁 Estructura del Proyecto

El espacio de trabajo está organizado con la siguiente estructura limpia y modular:

```text
SWAP_mente_lativa_jul26/
├── index.html                  # Estructura semántica principal y marcado de la web.
├── css/
│   └── style.css               # Hoja de estilos premium (variables, layouts, responsive).
├── js/
│   └── main.js                 # Lógica interactiva (Lenis scroll, ScrollTrigger GSAP, Cursor, Marquee).
├── assets/
│   ├── video.mp4               # Video intro (preloader de neón a pantalla completa).
│   └── logos/
│       ├── logo_mente_lativa.png  # Logotipo principal del estudio.
│       ├── hospitality/        # 17 logotipos segmentados de hoteles de lujo (Zadún, Chablé, etc.).
│       └── brands/             # 30 logotipos segmentados de marcas asociadas y casos de éxito.
├── MENTE LATIVA ppt 26 ok.pdf  # Diapositivas de referencia del cliente.
└── Colores de marca MENTE LATIVA.png # Imagen de paleta cromática original.
```

---

## 🎨 Sistema de Diseño (Estilos & Colores)

El sitio utiliza una paleta cromática y de tipografía extraída con precisión de las especificaciones y diapositivas del cliente:

### Paleta de Colores (CSS Variables)
*   **Negro profundo (`--bg-black`):** `#030103` (Fondo de secciones oscuras e intro)
*   **Verde azulado/Teal (`--bg-teal`):** `#4197B4` (Fondo de sección Dos Lenguajes)
*   **Crema cálido (`--bg-cream`):** `#FEFAF2` (Fondo de El Estudio y Portafolio)
*   **Dorado claro (`--text-gold-light`):** `#FFBD58` (Textos destacados sobre fondos oscuros)
*   **Dorado oscuro (`--text-gold-dark`):** `#CD8B37` (Textos destacados sobre fondos claros)
*   **Teal oscuro (`--text-teal-dark`):** `#12708F` (Subtítulos en secciones claras)

### Tipografía (Google Fonts)
*   **Serif Headlines (`--font-serif`):** `Playfair Display`, serif. Utilizado para dar un toque editorial clásico a títulos, frases destacadas y palabras en cursiva (`font-style: italic`).
*   **Sans-serif Body (`--font-sans`):** `Outfit`, sans-serif. Utilizado para textos descriptivos, listados de servicios y etiquetas de navegación, dando un toque moderno y geométrico.

---

## 🚀 Funcionalidades Clave

1.  **Intro Preloader con Audio Inteligente:**
    *   Reproduce `video.mp4` a pantalla completa en la carga inicial.
    *   **Fallback de Autoplay:** Si el navegador bloquea el audio automático, la intro se silencia para garantizar la fluidez visual de la carga.
    *   **Audio Toggle:** Un control sutil (icono de bocina) permite activar/desactivar el sonido en cualquier momento.
    *   **Botón Saltar Intro:** Desvanece la intro y habilita el scroll de forma inmediata.
2.  **Scroll Smooth (Lenis):** Integración nativa de desplazamiento suave a 60 FPS sin jaloneos.
3.  **Scroll Horizontal (GSAP):** La sección **Método REVELA™** bloquea la pantalla verticalmente y permite avanzar de forma horizontal por sus 4 pasos (Descubrir, Definir, Expresar, Activar).
4.  **Temas Dinámicos en Scroll:** El fondo de la página cambia de color suavemente conforme el usuario hace scroll entre diferentes secciones.
5.  **Marquesina Continua de Portafolio:** Logotipos en escala de grises con transición de color y escala interactiva en hover.
6.  **Cursor Líquido Personalizado:** Puntero doble interactivo que aumenta de escala y opacidad al pasar sobre elementos clicables.
7.  **Formulario Conversacional:** Formulario integrado directamente en oraciones del sitio para un cierre de contacto personalizado.

---

## 💻 Ejecución Local y Despliegue

### Ejecución Local
Al ser un sitio web estático, puedes abrir directamente el archivo `index.html` en cualquier navegador. Sin embargo, para probar el video preloader y el audio sin restricciones de CORS, se recomienda levantar un servidor local rápido.

*   **Usando Python:**
    ```bash
    python -m http.server 8000
    ```
    Luego, ingresa a [http://localhost:8000](http://localhost:8000) en tu navegador.

*   **Usando Node.js (http-server):**
    ```bash
    npx http-server ./
    ```

### Despliegue
El sitio está listo para subirse con rutas relativas limpias. Puedes arrastrar la carpeta completa a plataformas gratuitas y optimizadas como:
*   **Netlify**
*   **Vercel**
*   **GitHub Pages**
