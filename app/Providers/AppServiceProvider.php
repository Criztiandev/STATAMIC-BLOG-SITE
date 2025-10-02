<?php

namespace App\Providers;

use App\Markdown\HeadingRenderer;
use App\Markdown\ImageRenderer;
use App\Markdown\ParagraphRenderer;
use Illuminate\Support\ServiceProvider;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Extension\CommonMark\Node\Inline\Image;
use Statamic\Facades\Markdown;
use Statamic\Statamic;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Statamic::vite('app', [
        //     'resources/js/cp.js',
        //     'resources/css/cp.css',
        // ]);

        // Add custom Markdown renderers
        // Markdown::addRenderers(fn() => [
        //     Image::class => new ImageRenderer(),
        //     Heading::class => new HeadingRenderer(),
        //     Paragraph::class => new ParagraphRenderer(),
        // ]);
    }
}
