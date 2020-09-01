<?php

/**
 * 
 * Template Name: Design Studio
 */
get_header(); ?>
<style>
    #content .woostify-container {
        width: 100% !important;
        padding: 0 !important;
        max-width: 100% !important;
    }
</style>
<?php if (get_the_post_thumbnail_url()) : ?>
    <section class="tiler-hero" style="background-image: url(<?= get_the_post_thumbnail_url() ?>);">
        <div class="tiler-background-overlay"></div>
        <div class="tiler-page-title">
            <div class="titler">
                <h1><?php the_title() ?></h1>
            </div>
            <div class="container">
                <div class="breadcrumb">
                    <div class="tiler-breadcrumbs__wrap">
                        <div class="tiler-breadcrumbs__item"><a href="<?= get_bloginfo('url') ?>" class="tiler-breadcrumbs__item-link is-home" rel="home" title="<?= get_bloginfo('name') ?>"><?= get_bloginfo('name') ?></a></div>
                        <div class="tiler-breadcrumbs__item">
                            <div class="tiler-breadcrumbs__item-sep"><span class="tiler-blocks-icon">&gt;</span></div>
                        </div>
                        <div class="tiler-breadcrumbs__item"><a href="<?= get_bloginfo('url') ?>/shop" class="tiler-breadcrumbs__item-link is-home" rel="home" title="Products">Products</a></div>
                        <div class="tiler-breadcrumbs__item">
                            <div class="tiler-breadcrumbs__item-sep"><span class="tiler-blocks-icon">&gt;</span></div>
                        </div>
                        <div class="tiler-breadcrumbs__item"><span class="tiler-breadcrumbs__item-target"><?php the_title() ?></span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>
<div class="container">
    <?php echo do_shortcode('[tiles_generator]'); ?>
</div>
<div class="container">
    <?php
    $page = get_page_by_title('Tiler', OBJECT, 'page');
    if (!empty($page) && $page != null) {
        get_the_content(null, false, $page->ID);
    }
    ?>
</div>
<?php get_footer(); ?>