<?php

/**
 * @package TilerPlugin
 *
 */

namespace Inc\Pages;

use \Inc\Api\SettingsApi;
use \Inc\Base\BaseController;
use Inc\Api\Callbacks\AdminCallbacks;

class Admin extends BaseController
{
    public $settings, $callbacks, $pages = [];

    public function register()
    {
        $this->settings = new SettingsApi();

        $this->callbacks = new AdminCallbacks();

        $this->setPages();

        // $this->settings->addPages($this->pages)->register();
    }

    public function setPages()
    {
        $this->pages = [
            [
                'page_title' => 'Tiler Plugin',
                'menu_title' => 'Tiler',
                'capability' => 'manage_options',
                'menu_slug' => 'tiler_plugin',
                'callback' => [$this->callbacks, 'adminDashboard'],
                'icon_url' => 'dashicons-tablet',
                'position' => 110
            ]
        ];
    }
}
