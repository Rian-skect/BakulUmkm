<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Ambil dari ENV
$url = getenv("SUPABASE_URL");
$key = trim(getenv("SUPABASE_KEY"));

if (!$url || !$key) {
    echo json_encode(["error" => "ENV tidak terbaca"]);
    exit;
}

$full_url = $url . "/rest/v1/db_umkm?select=*";

// Buat request pakai file_get_contents
$headers = [
    "apikey: {$key}",
    "Authorization: Bearer {$key}",
    "Content-Type: application/json"
];

$opts = [
    "http" => [
        "method" => "GET",
        "header" => implode("\r\n", $headers)
    ]
];

$context = stream_context_create($opts);
$response = file_get_contents($full_url, false, $context);

if ($response === FALSE) {
    echo json_encode(["error" => "Gagal ambil data dari Supabase"]);
    exit;
}

echo $response;
