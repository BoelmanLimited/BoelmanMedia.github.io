<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['propertyId']) || !isset($data['photoId'])) {
        throw new Exception('Missing required data');
    }

    $propertyId = $data['propertyId'];
    $photoId = $data['photoId'];

    // Load properties data
    $properties = json_decode(file_get_contents(__DIR__ . '/../data/properties.json') ?? '[]', true);
    $propertyIndex = array_search($propertyId, array_column($properties, 'id'));
    
    if ($propertyIndex === false) {
        throw new Exception('Property not found');
    }

    // Find and remove the photo
    $gallery = &$properties[$propertyIndex]['gallery'];
    $photoIndex = array_search($photoId, array_column($gallery, 'id'));
    
    if ($photoIndex === false) {
        throw new Exception('Photo not found');
    }

    // Delete the physical file
    $photoPath = __DIR__ . '/.' . $gallery[$photoIndex]['url'];
    if (file_exists($photoPath)) {
        unlink($photoPath);
    }

    // Remove from gallery array
    array_splice($gallery, $photoIndex, 1);

    // Save updated properties data
    file_put_contents(__DIR__ . '/../data/properties.json', json_encode($properties));

    echo json_encode([
        'success' => true,
        'message' => 'Photo deleted successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 