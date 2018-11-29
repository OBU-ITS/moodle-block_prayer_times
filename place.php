<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Place - Returns the nearest place to the given coordinates
 *
 * @package    prayer_times
 * @category   block
 * @copyright  2017, Oxford Brookes University {@link http://www.brookes.ac.uk/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 
require_once('../../config.php');

if (!isloggedin()) {
	print 'Somewhere';
	exit;
}

$latitude = required_param('lat', PARAM_TEXT);
$longitude = required_param('lng', PARAM_TEXT);
$geonames_account = get_config('block_prayer_times', 'geonames_account');
$url = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' . $latitude . '&lng=' . $longitude . '&username=' . $geonames_account;

$curl_session = curl_init($url);
curl_setopt($curl_session, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl_session);
curl_close($curl_session);

$place = json_decode($response, true);
print($place["geonames"][0]["toponymName"]); 