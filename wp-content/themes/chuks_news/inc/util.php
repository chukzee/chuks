<?php

function normalize_href($url = '') {
    $home_url = get_home_url();
    $starts_with_home_url = substr($url, 0, strlen($home_url)) === $home_url;
    $href = !empty($url) ?
            ($url == '#' ? '#' 
            : ($starts_with_home_url ? $url 
            : $home_url . $url )) 
            : '';
    
    return $href;
}
