<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProjectController;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

Route::get('/api/blogs/load-more', [BlogController::class, 'loadMore']);
Route::get('/api/projects/load-more', [ProjectController::class, 'loadMore']);
