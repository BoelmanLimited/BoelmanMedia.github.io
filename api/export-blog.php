<?php
header('Content-Type: application/json');

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['blogId'])) {
        throw new Exception('Blog ID is required');
    }
    
    // Read blogs data
    $blogsJson = file_get_contents(__DIR__ . '/../data/blogs.json');
    $blogs = json_decode($blogsJson, true);
    
    // Find the blog
    $blog = null;
    foreach ($blogs as $b) {
        if ($b['id'] === $data['blogId']) {
            $blog = $b;
            break;
        }
    }
    
    if (!$blog) {
        throw new Exception('Blog not found');
    }
    
    // Create blog directory if it doesn't exist
    $blogDir = __DIR__ . '/../blog/posts';
    if (!file_exists($blogDir)) {
        mkdir($blogDir, 0777, true);
    }
    
    // Create the blog file
    $filename = $blogDir . '/' . $blog['id'] . '.html';
    if (file_put_contents($filename, $blog['content']) === false) {
        throw new Exception('Failed to write blog file');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Blog exported successfully',
        'url' => '/blog/posts/' . $blog['id'] . '.html'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 