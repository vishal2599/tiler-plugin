<?php

/**
 * @package TilerPlugin
 *
 */
/*
Plugin Name: Tiler Plugin
Description: This is a plugin to generate Tiles for different surfaces. Please Go to page Tiler to view the Awesomeness of the Tiler Plugin. Note: This Plugin imports Tiles from WooCommerce products.
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
register_activation_hook(__FILE__, 'activate_tiler_plugin');


// Method that runs on Plugin Deactivation
function deactivate_tiler_plugin()
{
    Inc\Base\Deactivate::deactivate();
}
register_deactivation_hook(__FILE__, 'deactivate_tiler_plugin');


if (class_exists("Inc\\Init")) {
    Inc\Init::register_services();
}


function tiler_image_uploader_field($post = null)
{

    wp_nonce_field('tiler_pattern_save_meta_box_data', 'tiler_pattern_meta_box_nonce');

    $value = get_post_meta($post->ID, '_tiler_pattern', true);

    $image = ' button">Upload image';
    $image_size = 'full'; // it would be better to use thumbnail size here (150x150 or so)
    $display = 'none'; // display state ot the "Remove image" button
    if ($image_attributes = wp_get_attachment_image_src($value, $image_size)) {

        $image = '"><img src="' . $image_attributes[0] . '" />';
        $display = 'block';
    }

    echo '
<div>
<style>
a.tiler_upload_image_button {
    display: inline-block;
    background: #ccc;
    border: 1px solid #999;
    padding: 2px;
}
a.tiler_upload_image_button {
    display: block;
    margin-bottom: 5px;
    width: 150px;
    padding: 5px;
    text-align: center;
}
a.tiler_remove_image_button {
    color: red;
}
.tiler_upload_image_button img{
    max-width:100%;
}
</style>
    <a href="#" class="tiler_upload_image_button' . $image . '</a>
    <input type="hidden" name="tiler_pattern" id="tiler_pattern" value="' . esc_attr($value) . '" />
    <a href="#" class="tiler_remove_image_button" style="display:' . $display . '">Remove image</a>
</div>';
?>
    <script>
        jQuery(function($) {
            /*
             * Select/Upload image(s) event
             */
            $('body').on('click', '.tiler_upload_image_button', function(e) {
                e.preventDefault();
                var button = $(this),
                    custom_uploader = wp.media({
                        title: 'Insert image',
                        library: {
                            // uncomment the next line if you want to attach image to the current post
                            // uploadedTo : wp.media.view.settings.post.id, 
                            type: 'image'
                        },
                        button: {
                            text: 'Use this image' // button label text
                        },
                        multiple: false // for multiple image selection set to true
                    }).on('select', function() { // it also has "open" and "close" events 
                        var attachment = custom_uploader.state().get('selection').first().toJSON();
                        console.log(attachment);
                        $(button).removeClass('button').html('<img class="true_pre_image" src="' + attachment.sizes.full.url + '" />').next().val(attachment.id).next().show();
                    })
                    .open();
            });

            /*
             * Remove image event
             */
            $('body').on('click', '.tiler_remove_image_button', function() {
                $(this).hide().prev().val('').prev().addClass('button').html('Upload image');
                return false;
            });

        });
    </script>
<?php

    if (!did_action('wp_enqueue_media')) {
        wp_enqueue_media();
    }
}


function tiler_pattern_save_meta_box_data($post_id)
{
    
    if (!isset($_POST['tiler_pattern_meta_box_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['tiler_pattern_meta_box_nonce'], 'tiler_pattern_save_meta_box_data')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check the user's permissions.
    if (isset($_POST['post_type']) && 'page' == $_POST['post_type']) {

        if (!current_user_can('edit_page', $post_id)) {
            return;
        }
    } else {

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }

    if (!isset($_POST['tiler_pattern'])) {
        return;
    }

    $my_data = sanitize_text_field($_POST['tiler_pattern']);

    update_post_meta($post_id, '_tiler_pattern', $my_data);
}
add_action('save_post', 'tiler_pattern_save_meta_box_data');