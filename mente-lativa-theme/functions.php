<?php
/**
 * Mente Lativa Theme Functions and Definitions
 *
 * @package MenteLativa
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Theme Setup
 */
function mente_lativa_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
}
add_action( 'after_setup_theme', 'mente_lativa_setup' );

/**
 * Enqueue scripts and styles.
 */
function mente_lativa_scripts() {
    // 1. Google Fonts Preconnect & Fonts
    wp_enqueue_style( 'mente-lativa-google-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap', array(), null );

    // 2. Core Theme Stylesheet
    $style_ver = file_exists( get_template_directory() . '/css/style.css' ) ? filemtime( get_template_directory() . '/css/style.css' ) : '1.0.0';
    wp_enqueue_style( 'mente-lativa-main-style', get_template_directory_uri() . '/css/style.css', array(), $style_ver );
    wp_enqueue_style( 'mente-lativa-theme-style', get_stylesheet_uri(), array( 'mente-lativa-main-style' ), '1.0.0' );

    // 3. GSAP & ScrollTrigger
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', array( 'gsap' ), '3.12.5', true );

    // 4. Lenis Smooth Scroll
    wp_enqueue_script( 'lenis', 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.33/dist/lenis.min.js', array(), '1.0.33', true );

    // 5. Main Custom Interactions Script
    $js_ver = file_exists( get_template_directory() . '/js/main.js' ) ? filemtime( get_template_directory() . '/js/main.js' ) : '1.0.0';
    wp_enqueue_script( 'mente-lativa-main', get_template_directory_uri() . '/js/main.js', array( 'gsap', 'gsap-scrolltrigger', 'lenis' ), $js_ver, true );

    // 6. Localize script for dynamic paths & AJAX
    wp_localize_script( 'mente-lativa-main', 'menteLativaData', array(
        'themeUrl' => get_template_directory_uri(),
        'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
        'nonce'    => wp_create_nonce( 'mente_contact_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'mente_lativa_scripts' );

/**
 * Handle Conversational Form AJAX Submission
 */
function mente_lativa_handle_contact() {
    // Check nonce if present
    if ( isset( $_POST['nonce'] ) && ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'mente_contact_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'Seguridad inválida' ), 403 );
    }

    $name     = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
    $company  = isset( $_POST['company'] ) ? sanitize_text_field( wp_unslash( $_POST['company'] ) ) : '';
    $email    = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
    $interest = isset( $_POST['interest'] ) ? sanitize_text_field( wp_unslash( $_POST['interest'] ) ) : '';

    if ( empty( $name ) || empty( $email ) ) {
        wp_send_json_error( array( 'message' => 'Campos obligatorios faltantes' ), 400 );
    }

    $to      = get_option( 'admin_email' );
    $subject = 'Nuevo contacto web: ' . $name . ' (' . $company . ')';
    $message = "Has recibido una nueva solicitud de contacto desde mentelativa.mx:\n\n"
             . "Nombre: " . $name . "\n"
             . "Marca / Empresa: " . $company . "\n"
             . "Correo: " . $email . "\n"
             . "Interés: " . $interest . "\n\n"
             . "--\nEnviado desde el portal de Mente Lativa";

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>'
    );

    wp_mail( $to, $subject, $message, $headers );

    wp_send_json_success( array( 'message' => 'Mensaje enviado exitosamente' ) );
}
add_action( 'wp_ajax_mente_lativa_contact', 'mente_lativa_handle_contact' );
add_action( 'wp_ajax_nopriv_mente_lativa_contact', 'mente_lativa_handle_contact' );
