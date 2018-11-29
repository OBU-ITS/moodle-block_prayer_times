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
 * Display prayer times block
 *
 * @package    prayer_times
 * @category   block
 * @copyright  2017, Oxford Brookes University {@link http://www.brookes.ac.uk/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 
class block_prayer_times_edit_form extends block_edit_form {

	protected function specific_definition($mform) {
 
		// Section header title according to language file.
		$mform->addElement('header', 'configheader', get_string('blocksettings', 'block'));
		
		$options = array(
			get_string('mwl', 'block_prayer_times'),
			get_string('uis', 'block_prayer_times'),
			get_string('isn', 'block_prayer_times'),
			get_string('ega', 'block_prayer_times')
		);
		$mform->addElement('select', 'config_fi', get_string('fi', 'block_prayer_times'), $options);

		$options = array(
			get_string('std', 'block_prayer_times'),
			get_string('han', 'block_prayer_times')
		);
		$mform->addElement('select', 'config_asr', get_string('asr', 'block_prayer_times'), $options);
	}
}