<?php

/**
 * @package TilerPlugin
 *
 */

namespace Inc\Base;

class CreateShortcode extends BaseController
{
    public function register()
    {
        add_shortcode('tiles_generator', array($this, 'tilesShortcode'));
    }

    public function tilesShortcode()
    {
        if ( file_exists("$this->plugin_path/templates/tilerTemplate.php")){
            ob_start();
            
            include("$this->plugin_path/templates/tilerContent.php");
            
            $content = ob_get_clean();
            
            return $content;
       }
    }
}
