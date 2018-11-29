//
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
 * Prayer times - javascript functions
 *
 * @package    prayer_times
 * @category   block
 * @copyright  2017, Oxford Brookes University {@link http://www.brookes.ac.uk/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 // Converts from degrees to radians.
function toRadians(degrees) {
	return degrees * Math.PI / 180;
}
 
// Converts from radians to degrees.
function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

function showLocation(location) {

	var lat, lng, xhr;

	latitude = 51.8;//location.coords.latitude;
	lat = Math.round(Math.abs(latitude) * 100) / 100;
	lat += '&deg;';
	if (latitude >= 0) {
		lat += 'N';
	} else {
		lat += 'S';
	}

	longitude = -1.3;//location.coords.longitude;
	lng = Math.round(Math.abs(longitude) * 100) / 100;
	lng += '&deg;';
	if (longitude >= 0) {
		lng += 'E';
	} else {
		lng += 'W';
	}

	header.innerHTML = lat + ', ' + lng; 

    xhr = new XMLHttpRequest();
    xhr.open("GET", "/blocks/prayer_times/place.php?lat=" + latitude + "&lng=" + longitude, true);
	xhr.onload = function (e) {
		if (xhr.responseText) {
			header.innerHTML += ' (' + xhr.responseText + ')';
		}
	}
    xhr.send();

	showTimes();
}

function showTimes() {
	var contentHTML;

	var latitudeKaaba = 21.4225;
	var longitudeKaaba = 39.8261;

	var lat = toRadians(latitude);
	var lng = toRadians(longitude);
	var latKaaba = toRadians(latitudeKaaba);
	var lngKaaba = toRadians(longitudeKaaba);
	
    var now = new Date();//(2012, 08, 28, 11, 35, 0, 0);
	var year = now.getUTCFullYear();
	var month = now.getUTCMonth() + 1;
	var day = now.getUTCDate();
	var hour = now.getUTCHours();
	var minute = now.getUTCMinutes();
	var second = now.getUTCSeconds();

	var qibla;
	var days;
	var hours;
	var fractionalYear;
	var declination;
	var timeCorrection;
	var solarHourAngle;
	var solarZenithAngle;
	var sunBearing;
	var solarNoon;
	var dHours;
	var degrees;
	var timeFajr;
	var sunRise;
	var timeDhuhr;
	var timeAsr;
	var sunSet;
	var timeMaghrib;
	var timeIsha;

	var y = Math.sin(lngKaaba - lng) * Math.cos(latKaaba);
	var x = Math.cos(lat) * Math.sin(latKaaba) - Math.sin(lat) * Math.cos(latKaaba) * Math.cos(lngKaaba - lng);
	qibla = toDegrees(Math.atan2(y, x));
	if (qibla < 0) qibla += 360;
	qibla = Math.round(qibla);

	contentHTML = '<tr><td>Qibla</td><td>' + qibla + '&deg;</td></tr>'; 

	// days passed this year
	var start = new Date(year, 0, 1);
	days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
		
	// hours passed today
	hours = hour + (minute / 60) + (second / 3600);

	fractionalYear = getFractionalYear(days, hours); // radians
	declination = getDeclination(fractionalYear); // radians
	timeCorrection = getTimeCorrection(fractionalYear);
		
	// Solar Hour Angle
	solarHourAngle = ((hours - 12) * 15) + longitude + timeCorrection;
	if (solarHourAngle < -180)
		solarHourAngle += 360;
	else if (solarHourAngle > 180)
		solarHourAngle -= 360;
		
	// Solar Zenith Angle
	var cosSZA = (Math.sin(lat)
		* Math.sin(declination))
		+ (Math.cos(lat)
		* Math.cos(declination)
		* Math.cos(toRadians(solarHourAngle)));
	if (cosSZA < -1)
		cosSZA = -1;
	else if (cosSZA > 1)
		cosSZA = 1;
	solarZenithAngle = toDegrees(Math.acos(cosSZA));
		
    // Solar Azimuth (sun bearing)
	var cosAZ = (Math.sin(declination)
    	- Math.sin(lat)
	   	* Math.cos(toRadians(solarZenithAngle)))
    	/ (Math.cos(lat)
    	* Math.sin(toRadians(solarZenithAngle)));
	if (cosAZ < -1)
		cosAZ = -1;
	else if (cosAZ > 1)
		cosAZ = 1;
	sunBearing = toDegrees(Math.acos(cosAZ));
	if (solarHourAngle > 0) sunBearing = (360 - sunBearing); // only correct for solar morning
	    
    // Solar Noon
    solarNoon = 12 - ((longitude + timeCorrection) / 15);
	timeCorrection = getTimeCorrection(getFractionalYear(days, solarNoon)); // tune
	solarNoon = 12 - ((longitude + timeCorrection) / 15);
	    
	// Sunrise
	dHours = deltaHours(lat, 0.833, days, solarNoon);
	dHours = deltaHours(lat, 0.833, days, (solarNoon - dHours)); // tune
	sunRise = getLocal(solarNoon - dHours);
	    
	// Sunset
	dHours = deltaHours(lat, 0.833, days, solarNoon);
	dHours = deltaHours(lat, 0.833, days, (solarNoon + dHours)); // tune
	sunSet = getLocal(solarNoon + dHours);
	    
	if (config_fi == 2) // ISNA
	    degrees = 15.0;
	else if (config_fi == 3) // EGAS
		degrees = 19.5;
	else // MWL, UIS
		degrees = 18.0;
	dHours = deltaHours(lat, degrees, days, solarNoon);
	dHours = deltaHours(lat, degrees, days, (solarNoon - dHours)); // tune
	timeFajr = getLocal(solarNoon - dHours);
	timeDhuhr = getLocal(solarNoon);
	dHours = asrHours(lat, days, solarNoon);
	dHours = asrHours(lat, days, (solarNoon + dHours)); // tune
	timeAsr = getLocal(solarNoon + dHours);
	timeMaghrib = sunSet;
	if (config_fi == 0) // MWL
		degrees = 17.0;
	else if (config_fi == 1) // UIS
		degrees = 18.0;
	else if (config_fi == 2) // ISNA
		degrees = 15.0;
	else // EGAS
		degrees = 17.5;
	dHours = deltaHours(lat, degrees, days, solarNoon);
	dHours = deltaHours(lat, degrees, days, (solarNoon + dHours)); // tune
	timeIsha = getLocal(solarNoon + dHours);

	contentHTML += '<tr><td>Fajr</td><td>' + timeFajr + '</td></tr>'; 
	contentHTML += '<tr><td>Sunrise</td><td>' + sunRise + '</td></tr>'; 
	contentHTML += '<tr><td>Dhuhr</td><td>' + timeDhuhr + '</td></tr>'; 
	contentHTML += '<tr><td>Asr</td><td>' + timeAsr + '</td></tr>'; 
	contentHTML += '<tr><td>Maghrib</td><td>' + timeMaghrib + '</td></tr>'; 
	contentHTML += '<tr><td>Isha</td><td>' + timeIsha + '</td></tr>'; 

	content.innerHTML += '<table><tbody>' + contentHTML + '</tbody></table>'; 
}

function getFractionalYear(days, hours)
{
	var g = ((days + (hours / 24)) / 365.25) * 360; // degrees
		
	return toRadians(g);
}
	
function getDeclination(g)
{
	var d = 0.396372
		- 22.91327 * Math.cos(g)
		+ 4.02543 * Math.sin(g)
		- 0.387205 * Math.cos(2 * g)
		+ 0.051967 * Math.sin(2 * g)
		- 0.154527 * Math.cos(3 * g)
		+ 0.084798 * Math.sin(3 * g);
		
	return toRadians(d);
}
	
function getTimeCorrection(g)
{
	var c = 0.004297
		+ 0.107029 * Math.cos(g)
		- 1.837877 * Math.sin(g)
		- 0.837378 * Math.cos(2 * g)
		- 2.340475 * Math.sin(2 * g);
		
	return c;
}

function deltaHours(latRadians, angle, days, hours)
{
	var d = getDeclination(getFractionalYear(days, hours)); // radians

	var cosHA = (-Math.sin(toRadians(angle))
		- (Math.sin(latRadians)
		* Math.sin(d)))
		/ (Math.cos(latRadians)
		* Math.cos(d));
	    
	return toDegrees(Math.acos(cosHA)) / 15;
}
	
function asrHours(latRadians, days, hours)
{
	d = getDeclination(getFractionalYear(days, hours)); // radians

	var cosASR = (Math.sin(acotan((config_asr + 1)
		+ Math.tan(latRadians - d)))
		- (Math.sin(latRadians)
		* Math.sin(d)))
		/ (Math.cos(latRadians)
		* Math.cos(d));
	    
	return toDegrees(Math.acos(cosASR)) / 15;
}

function getLocal(hours) // get local time from UTC time
{
	var h = Math.floor(hours); // hours
	var m = Math.round((hours - h) * 60); // minutes
	var d = new Date();//(2012, 8, 28, 11, 35, 0, 0);

	d.setHours(h);
	d.setMinutes(m);
	d.setSeconds(0);
	d.setMilliseconds(0);

	h = d.getHours();
	if (h < 10) h = "0" + h;
	m = d.getMinutes();
	if (m < 10) m = "0" + m;

	return h + ':' + m;
}

function acotan(x)
{
	var a = Math.atan(x) + (Math.atan(1) * 2);
	if (a > (Math.PI / 2)) a = (Math.PI - a);

	return a;
}

function errorHandler(error) {
	if (error.code == error.PERMISSION_DENIED) {
		header.innerHTML = 'Permission to use location denied.';
	}
	else {
		header.innerHTML = 'Location is unavailable.';
	}
}

var header = document.getElementById("block_prayer_times_header");
var content = document.getElementById("block_prayer_times_content");
var footer = document.getElementById("block_prayer_times_footer");
var config_fi = Number(header.getAttribute("data-fi"));
var config_asr = Number(header.getAttribute("data-asr"));
var latitude, longitude;

if (navigator.geolocation) {
	header.innerHTML = "Getting location...";
	navigator.geolocation.getCurrentPosition(showLocation, errorHandler);
} else {
	header.innerHTML = "Geolocation is not supported by this browser.";
}
