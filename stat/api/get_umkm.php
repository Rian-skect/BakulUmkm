<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

$supabase_url = getenv("SUPABASE_URL") . "/rest/v1/db_umkm";
$supabase_key = trim(getenv("SUPABASE_KEY")); // trim untuk hapus newline

if (!$supabase_url || !$supabase_key) {
    echo json_encode([
        "error" => "ENV tidak terbaca",
        "url" => $supabase_url,
        "key" => substr($supabase_key, 0, 10) . "..."
    ]);
    exit;
}

$headers = [
    "apikey: {$supabase_key}",
    "Authorization: Bearer {$supabase_key}",
    "Content-Type: application/json",
    "Origin: https://bakul-umkm.vercel.app"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url . "?select=*");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo json_encode([
    "http_code" => $http_code,
    "error" => $error,
    "response" => json_decode($response, true)
]);
