<?php
/**
 * The header for Mente Lativa theme
 *
 * @package MenteLativa
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

  <!-- Custom Cursor -->
  <div id="custom-cursor" class="custom-cursor"></div>
  <div id="custom-cursor-follower" class="custom-cursor-follower"></div>

  <!-- Header Navigation -->
  <header id="main-header" class="main-header">
    <div class="header-container">
      <a href="#intro-banner" class="logo-link" id="logo-anchor">
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/logos/logo_mente_lativa.png' ); ?>" alt="Mente Lativa Logo" class="header-logo" id="header-logo-img">
        <span class="logo-text">MENTE LATIVA</span>
      </a>
      <nav id="main-nav" class="main-nav">
        <ul>
          <li><a href="#estudio" class="nav-link" id="nav-link-estudio">Somos</a></li>
          <li><a href="#servicios" class="nav-link" id="nav-link-servicios">Servicios</a></li>
          <li><a href="#metodo" class="nav-link" id="nav-link-metodo">Método REVELA™</a></li>
          <li><a href="#consultoria" class="nav-link" id="nav-link-consultoria">Consultoría</a></li>
          <li><a href="#talento" class="nav-link" id="nav-link-talento">Nuestra Filosofía</a></li>
          <li><a href="#portafolio" class="nav-link" id="nav-link-portafolio">Clientes</a></li>
          <li><a href="#contacto" class="nav-btn" id="nav-link-contacto">¿Conversamos?</a></li>
        </ul>
      </nav>
      <!-- Mobile Menu Toggle -->
      <button id="menu-toggle" class="menu-toggle" aria-label="Abrir Menú">
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </header>

  <!-- Main Website Container -->
  <main id="main-content">
