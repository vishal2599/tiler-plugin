<?php
/**
 * 
 * Template Name: Design Studio
 */
get_header(); ?>

<div class="container">

<?php echo do_shortcode('[tiles_generator]'); ?>

</div>
<div class="container">

<?php

$page = get_page_by_title('Tiler', OBJECT, 'page');

if( !empty($page) && $page != null ){
    get_the_content(null, false, $page->ID);
}


?>

</div>

<?php get_footer(); ?>