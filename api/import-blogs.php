<?php
header('Content-Type: application/json');

try {
    // Directory containing blog posts
    $blogDir = __DIR__ . '/../blog/posts';
    
    // Get all HTML files in the blog directory
    $blogFiles = glob($blogDir . '/*.html');
    
    $importedBlogs = [];
    
    foreach ($blogFiles as $file) {
        // Read the HTML content
        $content = file_get_contents($file);
        
        // Extract metadata using regex
        preg_match('/<title>(.*?)<\/title>/s', $content, $titleMatch);
        preg_match('/<meta name="author" content="(.*?)">/s', $content, $authorMatch);
        preg_match('/<meta name="date" content="(.*?)">/s', $content, $dateMatch);
        preg_match('/<meta name="excerpt" content="(.*?)">/s', $content, $excerptMatch);
        
        $blog = [
            'id' => basename($file, '.html'),
            'title' => $titleMatch[1] ?? 'Untitled',
            'author' => $authorMatch[1] ?? 'Unknown',
            'date' => $dateMatch[1] ?? date('Y-m-d'),
            'excerpt' => $excerptMatch[1] ?? '',
            'content' => $content,
            'url' => '/blog/posts/' . basename($file)
        ];
        
        $importedBlogs[] = $blog;
    }
    
    // Save to localStorage equivalent in PHP
    $blogsJson = json_encode($importedBlogs);
    file_put_contents(__DIR__ . '/../data/blogs.json', $blogsJson);
    
    echo json_encode([
        'success' => true,
        'message' => 'Blogs imported successfully',
        'blogs' => $importedBlogs
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 