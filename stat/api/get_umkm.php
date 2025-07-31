<?php
header("Content-Type: application/json");

echo json_encode([
    "SUPABASE_URL" => getenv("SUPABASE_URL"),
    "SUPABASE_KEY_START" => substr(getenv("SUPABASE_KEY"), 0, 10),
    "SUPABASE_KEY_LENGTH" => strlen(getenv("SUPABASE_KEY"))
]);
