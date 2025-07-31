<?php
header("Content-Type: application/json");

$supabase_url = getenv("SUPABASE_URL") . "/rest/v1/db_umkm?select=*";
$supabase_key = trim(getenv("SUPABASE_KEY"));

// Buat request
$headers = [
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key",
    "Content-Type: application/json"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HEADER, true); // supaya response header ikut tampil
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo json_encode([
    "sent_headers" => $headers,
    "http_code" => $http_code,
    "response" => $response
]);
