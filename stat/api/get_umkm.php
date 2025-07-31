<?php
header("Content-Type: application/json");

$url = "https://gykbniseplrqvrnabzdh.supabase.co/rest/v1/db_umkm?select=*";
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w";

$headers = [
    "apikey: {$key}",
    "Authorization: Bearer {$key}",
    "Content-Type: application/json"
];

$options = [
    "http" => [
        "method" => "GET",
        "header" => implode("\r\n", $headers)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response ?: json_encode(["error" => "Request gagal"]);
