<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

$supabase_url = getenv("https://gykbniseplrqvrnabzdh.supabase.co") . "/rest/v1/db_umkm";
$supabase_key = getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w");

// Debug cek apakah variabel terbaca
if (!$supabase_url || !$supabase_key) {
    echo json_encode([
        "error" => "ENV tidak terbaca",
        "url" => $supabase_url,
        "key" => substr($supabase_key, 0, 10) . "..."
    ]);
    exit;
}

$headers = [
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key",
    "Content-Type: application/json"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url . "?select=*");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo json_encode([
    "http_code" => $http_code,
    "response" => json_decode($response, true)
]);
?>
