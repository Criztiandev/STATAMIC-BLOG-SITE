<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

Route::get('/api/blogs/load-more', [BlogController::class, 'loadMore']);
