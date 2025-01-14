<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../uploads/properties';
$dataDir = __DIR__ . '/../data';

$tests = [
    'upload_dir_exists' => file_exists($uploadDir),
    'upload_dir_writable' => is_writable($uploadDir),
    'data_dir_exists' => file_exists($dataDir),
    'data_dir_writable' => is_writable($dataDir),
    'properties_json_exists' => file_exists($dataDir . '/properties.json'),
    'properties_json_writable' => is_writable($dataDir . '/properties.json'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'error_log_writable' => is_writable(__DIR__),
    'paths' => [
        'upload_dir' => $uploadDir,
        'data_dir' => $dataDir
    ]
];

echo json_encode($tests, JSON_PRETTY_PRINT);
?> 