<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['propertyId']) || !isset($data['order'])) {
        throw new Exception('Missing required data');
    }

    $propertyId = $data['propertyId'];
    $newOrder = $data['order'];

    // Load properties data
    $properties = json_decode(file_get_contents(__DIR__ . '/../data/properties.json') ?? '[]', true);
    $propertyIndex = array_search($propertyId, array_column($properties, 'id'));
    
    if ($propertyIndex === false) {
        throw new Exception('Property not found');
    }

    // Reorder gallery
    $gallery = &$properties[$propertyIndex]['gallery'];
    $orderedGallery = [];
    
    foreach ($newOrder as $photoId) {
        $photoIndex = array_search($photoId, array_column($gallery, 'id'));
        if ($photoIndex !== false) {
            $orderedGallery[] = $gallery[$photoIndex];
        }
    }

    $properties[$propertyIndex]['gallery'] = $orderedGallery;

    // Save updated properties data
    file_put_contents(__DIR__ . '/../data/properties.json', json_encode($properties));

    echo json_encode([
        'success' => true,
        'message' => 'Photo order updated successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 