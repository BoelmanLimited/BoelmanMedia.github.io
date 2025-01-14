<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Get the POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['propertyId']) || !isset($data['html'])) {
        throw new Exception('Missing required data');
    }

    // Create properties directory if it doesn't exist
    $propertyDir = __DIR__ . '/../properties/sites';
    if (!file_exists($propertyDir)) {
        if (!mkdir($propertyDir, 0777, true)) {
            throw new Exception('Failed to create directory: ' . $propertyDir);
        }
        chmod($propertyDir, 0777);
    }

    // Create the property website file
    $filename = $propertyDir . '/' . $data['propertyId'] . '.html';
    
    // Write the HTML content to the file
    if (file_put_contents($filename, $data['html']) === false) {
        throw new Exception('Failed to write file: ' . $filename);
    }
    chmod($filename, 0644);

    // Return success response with the URL
    echo json_encode([
        'success' => true,
        'message' => 'Property website created successfully',
        'url' => '/properties/sites/' . $data['propertyId'] . '.html'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'file' => __FILE__,
        'line' => __LINE__
    ]);
}
?> 