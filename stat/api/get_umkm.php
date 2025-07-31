<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Ambil ENV
$supabase_url = getenv("SUPABASE_URL") . "/rest/v1/db_umkm?select=*";
$supabase_key = trim(getenv("SUPABASE_KEY"));

if (!$supabase_url || !$supabase_key) {
    echo json_encode(["error" => "ENV tidak terbaca"]);
    exit;
}

// Buat context request
$options = [
    "http" => [
        "method" => "GET",
        "header" => "apikey: {$supabase_key}\r\n" .
                    "Authorization: Bearer {$supabase_key}\r\n" .
                    "Content-Type: application/json\r\n"
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($supabase_url, false, $context);

if ($response === FALSE) {
    echo json_encode(["error" => "Request gagal"]);
} else {
    echo $response;
}
