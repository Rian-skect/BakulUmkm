<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

// Ambil dari Environment Variable di Vercel
$supabase_url = getenv("supabase_url") . "/rest/v1/db_umkm";
$supabase_key = getenv("supabase_key");

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
