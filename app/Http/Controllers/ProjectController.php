<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Collection;

class ProjectController extends Controller
{
    public function loadMore(Request $request)
    {
        try {
            $offset = $request->get('offset', 0);
            $limit = 9; // 3 sections × 3 projects each

            // Get all projects excluding the root, then slice for pagination
            $allProjects = Collection::find('projects')
                ->queryEntries()
                ->where('slug', '!=', 'projects')
                ->get();

            $projects = $allProjects->slice($offset, $limit);
            $chunked = $projects->chunk(3);

            return response()->json([
                'sections' => $chunked->map(function ($chunk, $index) {
                    return [
                        'projects' => $chunk->map(function ($project) {
                            $content = $project->get('content');
                            $description = strlen($content) > 150
                                ? substr($content, 0, 150) . '...'
                                : $content;

                            return [
                                'title' => $project->get('title'),
                                'slug' => $project->slug(),
                                'url' => $project->url(),
                                'thumbnail' => $project->get('thumbnail'),
                                'description' => $description,
                            ];
                        })
                    ];
                }),
                'hasMore' => ($offset + $limit) < $allProjects->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
