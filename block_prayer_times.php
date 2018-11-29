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
 

class block_prayer_times extends block_base {
    public function init() {
        $this->title = get_string('prayer_times', 'block_prayer_times');
    }
	
	/**
	 * Locations where block can be displayed
	 *
	 * @return array
	 */

    public function applicable_formats() {
        return array('all' => true);
    }
	  
	/**
	 * Allow block multiples
	 * 
	 * @return boolean
	 */
	  
	public function instance_allow_multiple() {
	  return false;
	}

	/**
	 * Allow the block to have a configuration page
	 *
	 * @return boolean
	 */

	public function has_config() {
		return true;
	}
	
	/**
	 * Generate content of the block
	 * 
	 * @return type
	 */    
		  
	 public function get_content() {
		
		if ($this->content !== null) {
		  return $this->content;
		}

		$this->content =  new stdClass;
		$this->content->text = '<div id="block_prayer_times_header" data-fi="' . $this->config->fi . '" data-asr="' . $this->config->asr . '"></div><p></p><div id="block_prayer_times_content"></div><p></p><div id="block_prayer_times_footer"></div>';   
		$javascript = new moodle_url('/blocks/prayer_times/block_prayer_times.js');
		$this->content->text .= '<script type="text/javascript" src="' . $javascript . '" defer></script>';   
	   
		return $this->content;
	}
}
 






