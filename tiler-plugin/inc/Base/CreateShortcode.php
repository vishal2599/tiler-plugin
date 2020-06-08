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
            //turn on output buffering to capture script output
            ob_start();
            //include the specified file
            include("$this->plugin_path/templates/tilerContent.php");
            //assign the file output to $content variable and clean buffer
            $content = ob_get_clean();
            //return the $content
            //return is important for the output to appear at the correct position
            //in the content
            return $content;
       }
    }
}
