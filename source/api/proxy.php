<?php
$url = isset($_GET['url']) ? $_GET['url'] : $target_url;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    header('Content-Type: application/json');
    echo $response;
}

curl_close($ch);
