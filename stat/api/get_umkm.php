<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

$supabase_url = getenv("https://gykbniseplrqvrnabzdh.supabase.co") . "/rest/v1/db_umkm";
$supabase_key = getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url . "?select=*");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
