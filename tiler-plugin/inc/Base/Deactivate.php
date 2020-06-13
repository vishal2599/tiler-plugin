<?php

/**
 * @package TilerPlugin
 *
 */

 namespace Inc\Base;

 class Deactivate
 {
     public static function deactivate()
     {
         $obj = new Deactivate();
         $obj->trashPage();
         flush_rewrite_rules();
     }

     public function trashPage()
     {
        $page = get_page_by_title('Design Studio', OBJECT, 'page');

        if( !empty($page) && $page != null ){
            wp_trash_post( $page->ID );
        }
     }
 }
