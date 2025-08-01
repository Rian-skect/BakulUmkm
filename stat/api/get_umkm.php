<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$supabase_url = getenv("SUPABASE_URL") . "/rest/v1/db_umkm?select=*";
$supabase_key = getenv("SUPABASE_KEY");

$headers = [
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key",
    "Content-Type: application/json"
];

$options = [
    "http" => [
        "method" => "GET",
        "header" => implode("\r\n", $headers)
    ]
];

$response = file_get_contents($supabase_url, false, stream_context_create($options));

echo $response ?: json_encode(["error" => "Request gagal"]);
