<?php

/**
 * @package TilerPlugin
 *
 */

namespace Inc\Api\Callbacks;

use \Inc\Base\BaseController;

class AdminCallbacks extends BaseController
{
    public function adminDashboard()
    {
        require_once "$this->plugin_path/templates/admin.php";
    }
}