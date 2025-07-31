<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

// Ambil dari Environment Variable di Vercel
$supabase_url = getenv("https://gykbniseplrqvrnabzdh.supabase.co") . "/rest/v1/db_umkm";
$supabase_key = getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w");

// Cek apakah environment variable terbaca
if (!$supabase_url || !$supabase_key) {
    echo json_encode([
        "error" => "SUPABASE_URL atau SUPABASE_KEY tidak terbaca. Cek Environment Variables di Vercel."
    ]);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url . "?select=*");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

// Kalau ada error dari curl
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}

curl_close($ch);
echo $response;
?>
