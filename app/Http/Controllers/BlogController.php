<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Collection;

class BlogController extends Controller
{
    public function loadMore(Request $request)
    {
        try {
            $offset = $request->get('offset', 0);
            $limit = 9; // 3 sections × 3 blogs each

            // Get all blogs excluding the root, then slice for pagination
            $allBlogs = Collection::find('blogs')
                ->queryEntries()
                ->where('slug', '!=', 'blogs')
                ->get();

            $blogs = $allBlogs->slice($offset, $limit);
            $chunked = $blogs->chunk(3);

            return response()->json([
                'sections' => $chunked->map(function ($chunk, $index) {
                    return [
                        'blogs' => $chunk->map(function ($blog) {
                            return [
                                'title' => $blog->get('title'),
                                'slug' => $blog->slug(),
                                'url' => $blog->url(),
                            ];
                        })
                    ];
                }),
                'hasMore' => ($offset + $limit) < $allBlogs->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}