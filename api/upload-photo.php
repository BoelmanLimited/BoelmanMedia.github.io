<?php
header('Content-Type: application/json');

try {
    if (!isset($_FILES['photo']) || !isset($_POST['propertyId'])) {
        throw new Exception('Missing required data');
    }

    $propertyId = $_POST['propertyId'];
    $photo = $_FILES['photo'];

    // Create upload directories if they don't exist
    $uploadDir = __DIR__ . '/../uploads/properties/' . $propertyId;
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique filename
    $extension = pathinfo($photo['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $filepath = $uploadDir . '/' . $filename;

    // Move uploaded file
    if (!move_uploaded_file($photo['tmp_name'], $filepath)) {
        throw new Exception('Failed to save uploaded file');
    }

    // Create photo data
    $photoData = [
        'id' => uniqid('photo_'),
        'url' => '/uploads/properties/' . $propertyId . '/' . $filename,
        'caption' => '',
        'order' => time()
    ];

    // Update property photos in storage
    $properties = json_decode(file_get_contents(__DIR__ . '/../data/properties.json') ?? '[]', true);
    $propertyIndex = array_search($propertyId, array_column($properties, 'id'));
    
    if ($propertyIndex !== false) {
        if (!isset($properties[$propertyIndex]['gallery'])) {
            $properties[$propertyIndex]['gallery'] = [];
        }
        $properties[$propertyIndex]['gallery'][] = $photoData;
        file_put_contents(__DIR__ . '/../data/properties.json', json_encode($properties));
    }

    echo json_encode([
        'success' => true,
        'message' => 'Photo uploaded successfully',
        'photo' => $photoData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 