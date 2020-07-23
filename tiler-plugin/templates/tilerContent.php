<?php
$params = array('posts_per_page' => -1, 'post_type' => 'product', 'meta_query' => array(
    array(
        'key' => '_stock_status',
        'value' => 'instock',
        'compare' => '=',
    ),
    'relation' => 'OR',
    array(
        'key' => '_stock_status',
        'value' => '',
        'compare' => 'NOT EXISTS'
    ),
));
$wc_query = new WP_Query($params);
$plugin_dir = plugin_dir_url(dirname(__FILE__, 1));
?>
<input type="hidden" id="plugindir" name="plugindir" value="<?= $plugin_dir ?>">
<script>
    const galleryImgs = {
        hospitality: {
            isVisible: false,
            transform: "matrix3d(2.1, 0, 0, 0, -0.59, 0.7, 1.3, 0, 0, 0, 1, 0, 522, 0, 0, 1.4)",
            // transform: "perspective(4500px) rotateX(65deg) rotateZ(19deg) rotateY(-6deg) translateY(-10px) translateX(298px) translateZ(-119px) scale(1.2)"
        },
        workspace: {
            isVisible: false,
            transform: 'matrix3d(2.1, 0, 0, 0, -0.5, 0.1, 1.3, 0, 0, 0, 1, 0, -54, 0, 0, 1)'
            // transform:'matrix3d(0.89, 0, 0, 0, -0.337, 0.06, 1, 0, 0, 0, 0.1, 0.1, 151.2, 120.1, 0, 0.9)'
            // transform: "perspective(4500px) rotateX(68deg) rotateZ(10deg) rotateY(-8deg) translateY(-8px) translateX(-41px) translateZ(-121px)"
        },
        publicspace: {
            isVisible: false,
            transform: "matrix3d(2.1, 0, 0, 0, -0.6, 1.1, 1.3, 0, 0, 0, 1, 0, -24, 0, 0, 1.4)"
            // transform: "perspective(3400px) rotate3d(1.3, -0.52, 0.6, 46deg) translateX(-65px) translateY(-133px) scale(1.3)"
        },
        myphoto: {
            isVisible: false,
            transform: "none"
        }
    };
</script>
<div id="tiler-area" class="tiler-area">
    <div class="row">
        <div class="col-md-9" style="margin-top: 50px;">
            <div class="panel with-nav-tabs panel-default">
                <div class="panel-heading" style="padding-bottom: 0px;border-bottom: 1px solid;">
                    <ul class="nav nav-tabs" style="display: flex;justify-content: start;" id="tiler-tabs">
                        <li class="active">
                            <a href="#tab1default" data-toggle="tab">Design</a>
                        </li>
                        <li>
                            <a href="#tab2default" data-toggle="tab">Inspiration Gallery</a>
                        </li>
                    </ul>
                </div>
                <div class="panel-body" style="border-top: none;">
                    <div class="tab-content">
                        <div class="tab-pane fade in active" id="tab1default">
                            <div class="row">
                                <div class="col-sm-12 ">
                                    <div class="row top-controls">
                                        <div class="col-sm-4">
                                            <div class="dropdown configurator-item">
                                                <p style="margin:0px !important; padding:0px !important">Arrangement</p>
                                                <button class="" id="arrangementBtn" type="button" data-toggle="dropdown"></button>
                                                <ul id="arrangement" class="dropdown-menu" style="width: 350px !important;">
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <div class="dropdown configurator-item">
                                                <p style="margin:0px !important; padding:0px !important">Product</p>
                                                <button id="productBtn" class="dropdown-btn" type="button" data-toggle="dropdown">Select </button>
                                                <ul class="dropdown-menu tile-list" id="tile-list" style=" width: 500px;">
                                                </ul>
                                                <ul id="pseudoTileList" style="display:none;">
                                                    <?php if ($wc_query->have_posts()) : ?>
                                                        <?php while ($wc_query->have_posts()) :
                                                            $wc_query->the_post();
                                                            /* grab the url for the full size featured image */
                                                            $product = wc_get_product(get_the_ID());

                                                            $prodColors = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_colors', array('fields' => 'names'))));

                                                            $prodSize = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_dimensions', array('fields' => 'names'))));

                                                            $prodThickness = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_backing-thickness', array('fields' => 'names'))));

                                                            $prodWeight = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_weight', array('fields' => 'names'))));
                                                            $availability = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_lead-time', array('fields' => 'names'))));
                                                            $tiler_image_id = get_post_meta($product->id, '_tiler_pattern', true);
                                                            $featured_img_url = wp_get_attachment_image_src($tiler_image_id, 'full')[0];
                                                        ?>
                                                            <img class="single-tile-image" data-weight="<?php echo $prodWeight; ?>" data-thickness="<?php echo $prodThickness; ?>" data-size="<?php echo $prodSize; ?>" data-color="<?php echo $prodColors; ?>" data-product-id="<?php echo $product->get_id(); ?>" data-add-to-cart-url="<?php echo $product->get_permalink(); ?>" height="50" width="auto" data-name="<?php echo $product->get_name(); ?>" data-sku="<?php echo $product->get_sku(); ?>" data-slug="<?php echo $product->get_slug(); ?>" src="<?php echo $featured_img_url; ?>" data-availability='<?= $availability ?>' height="50" width="auto">
                                                        <?php endwhile; ?>
                                                        <?php wp_reset_postdata(); ?>
                                                    <?php else :  ?>
                                                        <li>
                                                            <?php _e('No Products'); ?>
                                                        </li>
                                                    <?php endif; ?>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-sm-5 controls">
                                            <div class="row">
                                                <div class="col-sm-5 left-control">
                                                    <p class="title">Tile Direction</p>
                                                    <div class="configurator-item direction" style="text-align: center;display:block;">
                                                        <img id="d_vertical" class="orientation-button o-vertical set-angle active" src="<?php echo $plugin_dir; ?>assets/images/button-tiledirection-vertical-off.png" data-angle="0" />
                                                        <img id="d_horizontal" class="orientation-button o-horizontal set-angle" src="<?php echo $plugin_dir; ?>assets/images/button-tiledirection-horiz-off.png" data-angle="90" />
                                                    </div>
                                                </div>
                                                <div class="col-sm-7 right-control">
                                                    <p style="margin: 0;">&nbsp;</p>
                                                    <div class="configurator-item">
                                                        <img id="fillAll" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-fill-off.png" data-toggle="tooltip" title="Fill All" />
                                                    </div>
                                                    <div class="configurator-item">
                                                        <img id="undo" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-undo-off.png" data-toggle="tooltip" title="Undo" />
                                                    </div>
                                                    <div class="configurator-item">
                                                        <img id="clear" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-clearall-off.png" data-toggle="tooltip" title="Clear All" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12 relative">
                                            <div id="others-div">
                                                <canvas style="border:1px solid #ccc" id="c" width="600" height="600"></canvas>
                                            </div>
                                            <div class="hidden-canvas">
                                                <canvas style="border:1px solid #ccc" id="tempV" width="450" height="450"></canvas>
                                            </div>
                                            <div class="hidden-canvas">
                                                <canvas style="border:1px solid #ccc" id="tempH" width="450" height="450"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> <!-- ends what-->
                        <div class="tab-pane fade" id="tab2default">
                            <div class="row p-2">
                                <div class="col-sm-12">
                                    <div class="configurator-item active">
                                        <button class="plugin-red-btn" id="hospitalityBtn" type="button">HOSPITALITY</button>
                                    </div>
                                    <div class="configurator-item">
                                        <button class="plugin-red-btn" id="workspaceBtn" type="button">WORKSPACE</button>
                                    </div>
                                    <div class="configurator-item">
                                        <button class="plugin-red-btn" id="publicspaceBtn" type="button">PUBLIC SPACE</button>
                                    </div>
                                </div>
                            </div>
                            <div class="row p-2">
                                <div class="col-sm-12">
                                    <div class="gallery-img-wrapper" style="height: auto;">
                                        <div id="hospitality">
                                            <img class="gallery-img" src="" style="position: static;transform-origin: bottom center 0px;" />
                                            <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/hospitality-overlay-2000.png" style="left: 0;" />
                                        </div>
                                        <div id="workspace">
                                            <img class="gallery-img" src="" style="position: static;transform-origin: bottom center 0px;" />
                                            <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/workspace-overlay-2000.png" style="left: 0;" />
                                        </div>
                                        <div id="publicspace">
                                            <img class="gallery-img" src="" style="position: static;transform-origin: bottom center 0px;" />
                                            <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/public-overlay-2000.png" style="left: 0;" />
                                        </div>
                                        <div id="myphoto">
                                            <img class="gallery-img" src="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- ends col-10?-->
        <div class="col-md-3" style="margin-top: 50px; max-height:800px; overflow-y:auto;">
            <p style="margin:0px !important; padding:0px !important;border-bottom: 1px solid;">Product Selected</p>
            <div id="selected-product-list">
            </div>

            <button class="plugin-red-btn" id="printPDF">
                Save spec sheet PDF
            </button>
            <p id="printPDFLabel" style="display:none;">AREA SCALE: 4m x 4m</p>

            <script id="handlebars-demo" type="text/x-handlebars-template">
                {{#each tilesFinal}}
                    <div style="display: flex;justify-content: space-around; margin-top:15px;">
                        <div style="display:inline-block;float:left;height:75px;width:75px;background-image:url('{{imgSrc}}'); background-size: 100%;">
                        </div>
                        <div style="display:inline-block;float:left;width: 200px;max-height: 200px;overflow: hidden;padding-left: 10px;">
                            <span style="display:block;line-height: 15px;margin-bottom: 8px;">{{productName}}</span>
                            <span style="display:block;font-size: 13px;line-height: 14px;margin-bottom: 5px;">{{productSKU}}</span>
                            <a href="{{productURL}}"><img src="<?php echo $plugin_dir; ?>assets/images/icon-info.png" height="20" width="20"></a>
                            <img style="cursor:pointer" class="single_add_to_cart_button" rel="nofollow" data-product_id="{{productID}}" data-product_sku="{{productSKU}}" src="<?php echo $plugin_dir; ?>assets/images/icon-addtocart.png" height="20" width="20" />
                        </div>
                    </div>
                {{/each}}
            </script>
        </div>
    </div>
</div>
<canvas id="procreate"></canvas>
<!-- .content-area -->