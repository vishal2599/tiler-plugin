<?php

/**
 * @package TilerPlugin
 *
 */

namespace Inc\Base;

class Enqueue extends BaseController
{
    public function register()
    {
        add_action('admin_enqueue_scripts', array($this, 'adminScripts'));
        add_action('wp_enqueue_scripts', array($this, 'userScripts'));
    }

    public function adminScripts()
    {
        wp_enqueue_style('tiler-style', $this->plugin_url . 'assets/admin/tiler.css');
        wp_enqueue_script('tiler-script', $this->plugin_url . 'assets/admin/tiler.js');
    }

    public function userScripts()
    {
        wp_enqueue_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js');
        
        wp_enqueue_style('bootstrap-css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
        wp_enqueue_style('flaticon-css', $this->plugin_url . 'assets/frontend/css/flaticon.css');
        wp_enqueue_style('scrollbar-css', $this->plugin_url . 'assets/frontend/css/jquery.scrollbar.css');
        wp_enqueue_style('main-style-css', $this->plugin_url . 'assets/frontend/css/main-style.css');
        
        wp_enqueue_style('style-css', $this->plugin_url . 'assets/frontend/css/style.css', ['bootstrap-css', 'flaticon-css', 'scrollbar-css', 'main-style-css']);

        wp_enqueue_script('fabric-js', $this->plugin_url . 'assets/frontend/js/fabric.min.js', array('jquery'));
        wp_enqueue_script('lodash-js', 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js', array('jquery'));
        wp_enqueue_script('handlebars-js', 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js', array('jquery'));

        wp_enqueue_script('pdfmake-js', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/pdfmake.min.js', array('jquery'));
        wp_enqueue_script('vfsfonts-js', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js', array('jquery'));
        wp_enqueue_script('main-js', $this->plugin_url . 'assets/frontend/js/main.js', array('jquery'));

    }
}
