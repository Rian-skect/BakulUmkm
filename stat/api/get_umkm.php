<?php
header("Content-Type: application/json");

echo json_encode([
    "SUPABASE_URL" => getenv("SUPABASE_URL"),
    "SUPABASE_KEY" => getenv("SUPABASE_KEY"),
    "all_env" => $_ENV // untuk melihat semua env yang tersedia
]);
