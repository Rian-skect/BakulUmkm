<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$url = "https://gykbniseplrqvrnabzdh.supabase.co/rest/v1/db_umkm?select=*";
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

$headers = implode("\r\n", [
    "apikey: $key",
    "Authorization: Bearer $key",
    "Content-Type: application/json"
]);

$options = [
    "http" => [
        "method" => "GET",
        "header" => $headers
    ]
];

$response = file_get_contents($url, false, stream_context_create($options));
echo $response ?: json_encode(["error" => "Request gagal"]);
