<?php

/**
 * @package TilerPlugin
 *
 */

namespace Inc\Base;

class WooFunctions extends BaseController
{
    public function register()
    {
        add_action('wp_ajax_ql_woocommerce_ajax_add_to_cart', [$this, 'ql_woocommerce_ajax_add_to_cart']);
        add_action('wp_ajax_nopriv_ql_woocommerce_ajax_add_to_cart', [$this, 'ql_woocommerce_ajax_add_to_cart']);
    }

    public function ql_woocommerce_ajax_add_to_cart()
    {

        $product_id = apply_filters('ql_woocommerce_add_to_cart_product_id', absint($_POST['product_id']));

        $quantity = empty($_POST['quantity']) ? 1 : wc_stock_amount($_POST['quantity']);

        $variation_id = absint($_POST['variation_id']);

        $passed_validation = apply_filters('ql_woocommerce_add_to_cart_validation', true, $product_id, $quantity);

        $product_status = get_post_status($product_id);

        if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity, $variation_id) && 'publish' === $product_status) {

            do_action('ql_woocommerce_ajax_added_to_cart', $product_id);

            if ('yes' === get_option('ql_woocommerce_cart_redirect_after_add')) {

                wc_add_to_cart_message(array($product_id => $quantity), true);
            }

            WC_AJAX::get_refreshed_fragments();
        } else {

            $data = array(

                'error' => true,

                'product_url' => apply_filters('ql_woocommerce_cart_redirect_after_error', get_permalink($product_id), $product_id)
            );

            echo wp_send_json($data);
        }

        wp_die();
    }
}
