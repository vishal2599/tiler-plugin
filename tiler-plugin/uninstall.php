<?php

/**
 * 
 * Trigger this file on Plugin Uninstall
 * 
 * @package TilerPlugin
 * 
 */

 if( !defined( 'WP_UNINSTALL_PLUGIN' ) ){
     die;
 }

 // Clear data stored in database
 
 $page = get_page_by_title('Design Studio', OBJECT, 'page');

 if( !empty($page) && $page != null ){
     wp_delete_post( $page->ID );
 }