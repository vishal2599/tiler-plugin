<?php

/**
 * @package TilerPlugin
 *
 */

 namespace Inc\Base;

class Activate extends BaseController
{
    public static function activate()
    {
        $obj = new Activate();
        $obj->createPage();
        flush_rewrite_rules();
    }

    public function createPage()
    {
        $args = [
            'post_title'    => 'Tiler',
            'post_content'  => '[tiles_generator]',
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_category' => array(1),
            'post_type'     => 'page'
        ];
        $page = get_page_by_title('Tiler', OBJECT, 'page');

        if( !empty($page) && $page != null ){
            $args['ID'] = $page->ID;
            wp_insert_post( $args );
        } else {
            wp_insert_post($args);
        }

        copy("$this->plugin_path/templates/tilerTemplate.php", get_stylesheet_directory(). '/page-tiler.php');
    }
}
