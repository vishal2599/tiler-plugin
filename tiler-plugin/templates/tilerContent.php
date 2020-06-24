<?php
$params = array('posts_per_page' => -1, 'post_type' => 'product');
$wc_query = new WP_Query($params);
$plugin_dir = plugin_dir_url(dirname(__FILE__, 1));
?>
<input type="hidden" id="plugindir" name="plugindir" value="<?= $plugin_dir ?>">
<script>
    const galleryImgs = {
        hospitality: {
            isVisible: false,
            // 			transform: "perspective(4500px) rotateX(65deg) rotateZ(2deg) rotateY(0deg) translateY(-10px) translateX(22px) translateZ(-119px)"
            transform: "perspective(4500px) rotateX(65deg) rotateZ(19deg) rotateY(-6deg) translateY(-10px) translateX(298px) translateZ(-119px) scale(1.2)"
        },
        workspace: {
            isVisible: false,
            // 			transform: "perspective(300px) rotateX(68deg) rotateZ(13deg) rotateY(-4deg) translateY(30px) translateX(88px) translateZ(-73px)"
            transform: "perspective(4500px) rotateX(68deg) rotateZ(10deg) rotateY(-8deg) translateY(-8px) translateX(-41px) translateZ(-121px)"
        },
        publicspace: {
            isVisible: false,
            // 			transform: "perspective(300px) rotateX(28deg) rotateZ(7deg) rotateY(0deg) translateY(-328px) translateX(175px) scale(2)"
            transform: "perspective(3400px) rotate3d(1.3, -0.52, 0.6, 46deg) translateX(-65px) translateY(-133px) scale(1.3)"
        },
        myphoto: {
            isVisible: false,
            transform: "none"
        }
    };
</script>
<style>
    .panel-default,
    .panel-default>.panel-heading {
        background-color: transparent;
        border: none;
        padding: 0;
    }

    .panel-body {
        border: 1px solid;
    }

    .page-content ul li {
        margin: 0;
        border-left: 1px solid;
        border-right: 1px solid;
        border-top: 1px solid;
        background-color: #efefef;
    }

    .page-content ul li.active {
        border-bottom: 1px #fff;
        margin-bottom: -2px;
        background-color: #fff;
    }

    .page-content ul li:first-child {
        margin-right: -1px;
    }

    .nav-tabs>li>a {
        padding: 8px 15px;
    }

    button#printPDF {
        background-color: #d23f38;
    }

    p#printPDFLabel {
        font-size: 11px;
    }
</style>
<div id="primary" class="content-area">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-9" style="margin-top: 50px;">
                <div class="panel with-nav-tabs panel-default">
                    <div class="panel-heading" style="padding-bottom: 0px;border-bottom: 0px;">
                        <ul class="nav nav-tabs" style="display: flex;justify-content: start;" id="tabList">
                            <li class="active">
                                <a href="#tab1default" data-toggle="tab">Design</a>
                            </li>
                            <li>
                                <a href="#tab2default" data-toggle="tab">Inspiration Gallery</a>
                            </li>
                        </ul>
                    </div>
                    <div class="panel-body">
                        <div class="tab-content">
                            <div class="tab-pane fade in active" id="tab1default">
                                <div class="row" style="margin-left:20px;">
                                    <div class="dropdown configurator-item">
                                        <p style="margin:0px !important; padding:0px !important">Arrangement</p>
                                        <button class="" id="arrangementBtn" type="button" style="background: #fff;color: #000;border: 1px solid #868686;" data-toggle="dropdown"></button>
                                        <ul id="arrangement" class="dropdown-menu" style="width: 350px !important;">
                                        </ul>
                                    </div>
                                    <div class="dropdown configurator-item" style="margin-left:25px">
                                        <p style="margin:0px !important; padding:0px !important">Product</p>
                                        <button id="productBtn" class="dropdown-btn" type="button" data-toggle="dropdown"></button>
                                        <ul class="dropdown-menu tile-list" id="tile-list" style=" width: 500px;">
                                        </ul>
                                        <ul id="pseudoTileList" style="display:none;">
                                            <?php if ($wc_query->have_posts()) : ?>
                                                <?php while ($wc_query->have_posts()) :
                                                    $wc_query->the_post();
                                                    /* grab the url for the full size featured image */
                                                    $product = wc_get_product(get_the_ID());

                                                    //$pa_color = array_values(wc_get_product_terms($product->id, 'pa_color', array('fields' => 'names')));
                                                    $prodColors = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_color', array('fields' => 'names'))));

                                                    $prodSize = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_size', array('fields' => 'names'))));

                                                    $prodThickness = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_thickness', array('fields' => 'names'))));

                                                    $prodWeight = implode(", ", array_values(wc_get_product_terms($product->id, 'pa_weight', array('fields' => 'names'))));

                                                    // $featured_img_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
                                                    // $featured_img_url = get_field('carpet_image', get_the_ID());

                                                    $featured_img_url = wp_get_attachment_image_src(get_post_thumbnail_id($product->id), 'single-post-thumbnail')[0];

                                                    //$colorAttr = $product->get_attribute( 'pa_color' );


                                                ?>
                                                    <img class="single-tile-image" data-weight="<?php echo $prodWeight; ?>" data-thickness="<?php echo $prodThickness; ?>" data-size="<?php echo $prodSize; ?>" data-color="<?php echo $prodColors; ?>" data-product-id="<?php echo $product->get_id(); ?>" data-add-to-cart-url="<?php echo $product->get_permalink(); ?>" height="50" width="auto" data-name="<?php echo $product->get_name(); ?>" data-sku="<?php echo $product->get_sku(); ?>" data-slug="<?php echo $product->get_slug(); ?>" src="<?php echo $featured_img_url; ?>" height="50" width="auto">
                                                <?php endwhile; ?>
                                                <?php wp_reset_postdata(); ?>
                                            <?php else :  ?>
                                                <li>
                                                    <?php _e('No Products'); ?>
                                                </li>
                                            <?php endif; ?>
                                        </ul>
                                    </div>
                                    <div class="configurator-item" style="margin-left: 25px;top: -25px;position: relative;">
                                        <p style="margin:0px !important; padding:0px !important">Tile Direction</p>
                                        <!-- <div style="inline-block;float:left;cursor:pointer"> -->
                                        <!-- <span>&#x2195;</span> -->

                                        <img style="display:inline-block;float:left;cursor:pointer" id="d_vertical" class="orientation-button o-vertical" src="<?php echo $plugin_dir; ?>assets/images/button-tiledirection-vertical-off.png" width="30" height="30" />
                                        <!-- <span>Vertical</span> -->
                                        <!-- </div> -->
                                        <!-- <div style="inline-block;float:left;cursor:pointer" class="orientation-button o-horizontal" style="inline-block;float:left;cursor:pointer;margin-left:10px;" class="orientation-button o-horizontal text-center"> -->
                                        <!-- <span>&#x2194;</span> -->
                                        <img style="margin-left:10px;display:inline-block;float:left;cursor:pointer" id="d_horizontal" class="orientation-button o-horizontal" src="<?php echo $plugin_dir; ?>assets/images/button-tiledirection-horiz-off.png" width="30" height="30" />
                                        <!-- <span>Horizontal</span> -->
                                        <!-- </div> -->
                                    </div>
                                    <div class="configurator-item" style="margin-left: 25px;top: -25px;position: relative;">
                                        <p style="margin:0px !important; padding:0px !important">Fill All</p>
                                        <!-- <div id="undo2" style="inline-block;float:left;cursor:pointer" class="orientation-button o-vertical text-center">
                                             <span>fill</span>
                                             <span>Vertical</span>
                                         </div> -->
                                        <img id="fillAll" style="margin-left:10px;display:inline-block;float:left;cursor:pointer" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-fill-off.png" width="30" height="30" />
                                    </div>
                                    <div class="configurator-item" style="margin-left: 25px;top: -25px;position: relative;">
                                        <p style="margin:0px !important; padding:0px !important">Undo</p>
                                        <!-- <div id="undo" style="inline-block;float:left;cursor:pointer" class="orientation-button icon-btn o-vertical text-center"> -->
                                        <!-- <span>undo</span> -->
                                        <!-- <span>Vertical</span> -->
                                        <!-- </div> -->
                                        <img id="undo" style="margin-left:10px;display:inline-block;float:left;cursor:pointer" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-undo-off.png" width="30" height="30" />
                                    </div>
                                    <div class="configurator-item" style="margin-left: 25px;top: -25px;position: relative;">
                                        <p style="margin:0px !important; padding:0px !important">Clear All</p>
                                        <!-- <div id="clear" style="inline-block;float:left;cursor:pointer" class="orientation-button icon-btn o-vertical text-center"> -->
                                        <!-- <span>clear</span> -->
                                        <!-- <span>Vertical</span> -->
                                        <!-- </div> -->
                                        <img id="clear" style="margin-left:10px;display:inline-block;float:left;cursor:pointer" class="orientation-button icon-btn" src="<?php echo $plugin_dir; ?>assets/images/button-clearall-off.png" width="30" height="30" />
                                    </div>

                                </div>
                                <div class="row">
                                    <div id="others-div" style="display: flex !important;justify-content: center !important;">
                                        <canvas style="border:1px solid #ccc" id="c" width="600" height="600"></canvas>
                                    </div>

                                    <div style="visibility:hidden">
                                        <canvas style="border:1px solid #ccc" id="tempV" width="450" height="450"></canvas>
                                    </div>
                                    <div style="visibility:hidden">
                                        <canvas style="border:1px solid #ccc" id="tempH" width="450" height="450"></canvas>
                                    </div>
                                </div>

                            </div> <!-- ends what-->
                            <div class="tab-pane fade" id="tab2default">
                                <div class="row p-2" style="margin-left:20px;">
                                    <div class="configurator-item active">
                                        <button class="" id="hospitalityBtn" type="button">HOSPITALITY</button>
                                    </div>
                                    <div class="configurator-item">
                                        <button class="" id="workspaceBtn" type="button">WORKSPACE</button>
                                    </div>
                                    <div class="configurator-item">
                                        <button class="" id="publicspaceBtn" type="button">PUBLIC SPACE</button>
                                    </div>
                                    <!--                                     <div class="configurator-item">
                                        <button class="" id="myphotoBtn" type="button">MY PHOTO</button>
                                    </div> -->
                                </div>
                                <div class="row p-2">
                                    <div style="display: flex !important;justify-content: center !important;">
                                        <div class="gallery-img-wrapper">
                                            <div id="hospitality">
                                                <img class="gallery-img" src="" />
                                                <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/hospitality-overlay-2000.png" />
                                            </div>
                                            <div id="workspace">
                                                <img class="gallery-img" src="" />
                                                <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/workspace-overlay-2000.png" />
                                            </div>
                                            <div id="publicspace">
                                                <img class="gallery-img" src="" />
                                                <img class="gallery-img" src="<?php echo $plugin_dir; ?>assets/images/public-overlay-2000.png" />
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

                <button id="printPDF" style="display:none;margin-top:20px;">
                    Save spec sheet PDF
                </button>
                <p id="printPDFLabel" style="display:none;">AREA SCALE: 4m x 4m</p>

                <script id="handlebars-demo" type="text/x-handlebars-template">
                    {{#each tilesFinal}}
                        <div style="display: flex;justify-content: space-around; margin-top:15px;">
                            <div style="display:inline-block;float:left;height:75px;width:75px;background-image:url('{{src}}'); background-size: 100%;">
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
</div>
<!-- .content-area -->