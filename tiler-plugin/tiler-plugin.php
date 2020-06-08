<?php

/**
 * @package TilerPlugin
 *
 */
/*
Plugin Name: Tiler Plugin
Description: This is a plugin to generate Tiles on the surfaces. Please Go to page Tiler to view the Awesomeness of the Tiler Plugin
Version: 1.0.0
License: GPLv2 or later
Text Domain: tiler-plugin
 */

// If this file is called directly, Abort!!
defined('ABSPATH') or die('Hey, what are you doing here? You silly human!');

// Require Once the Composer Autoload
if (file_exists(dirname(__FILE__) . '/vendor/autoload.php')) {
    require_once dirname(__FILE__) . '/vendor/autoload.php';
}

// Method that runs on Plugin Activation
function activate_tiler_plugin()
{
    Inc\Base\Activate::activate();
}
register_activation_hook( __FILE__ , 'activate_tiler_plugin' );


// Method that runs on Plugin Deactivation
function deactivate_tiler_plugin()
{
    Inc\Base\Deactivate::deactivate();
}
register_deactivation_hook( __FILE__ , 'deactivate_tiler_plugin' );


if( class_exists( "Inc\\Init" ) ){
    Inc\Init::register_services();
}