# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Statamic 5** CMS project built on **Laravel 12** and **PHP 8.2+**. Statamic is a flat-file, Git-powered CMS where content is stored as Markdown files and YAML configuration rather than in a database.

## Key Commands

### Development
```bash
# Start all development services (server, queue, logs, vite)
composer dev

# Alternative: Start dev server only
php artisan serve

# Build frontend assets
npm run build

# Watch frontend assets (alternative to composer dev)
npm run dev
```

### Statamic CLI
```bash
# Use the Statamic CLI tool (not Laravel's artisan)
php please <command>

# Common please commands
php please make:user          # Create a new user
php please make:collection    # Create a new collection
php please make:fieldset      # Create a new fieldset
php please make:blueprint     # Create a new blueprint
php please support:details    # Get system information
```

### Testing
```bash
# Run all tests
composer test
# OR
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run with filter
php artisan test --filter=test_method_name
```

### Code Quality
```bash
# Fix code style with Laravel Pint
vendor/bin/pint

# Run with specific preset
vendor/bin/pint --preset laravel
```

## Architecture

### Content Storage (Flat-File System)

Content is stored in the [content/](content/) directory as Markdown files with YAML frontmatter:

- **[content/collections/](content/collections/)** - Content entries organized by collection (blogs, pages, projects)
  - Each collection has a `.yaml` configuration file defining routes, templates, and behavior
  - Individual entries are `.md` files with frontmatter + content
  - Collections use date-based slugs (e.g., `2025-09-28.blog-title.md`)

- **[content/trees/](content/trees/)** - Navigation structures
- **[content/globals/](content/globals/)** - Global reusable content
- **[content/taxonomies/](content/taxonomies/)** - Taxonomies (tags, categories)
- **[content/assets/](content/assets/)** - Asset container configuration

### Views & Templates

- **Template Engine**: Statamic uses **Antlers** (similar to Blade, but with `{{ }}` syntax)
- **[resources/views/](resources/views/)** - Antlers templates
  - [layout.antlers.html](resources/views/layout.antlers.html) - Main layout file
  - [home.antlers.html](resources/views/home.antlers.html) - Homepage template
  - [default.antlers.html](resources/views/default.antlers.html) - Default entry template
  - [components/](resources/views/components/) - Reusable Antlers components
  - [partials/](resources/views/partials/) - Reusable template partials
  - [page/](resources/views/page/) - Page-specific templates

### Configuration

- **[resources/blueprints/](resources/blueprints/)** - Field blueprints (define content structure for collections, forms, etc.)
  - [collections/](resources/blueprints/collections/) - Collection-specific field definitions
  - [forms/](resources/blueprints/forms/) - Form field definitions

- **[resources/fieldsets/](resources/fieldsets/)** - Reusable field groups

- **[config/statamic/](config/statamic/)** - Statamic-specific configuration
  - [cp.php](config/statamic/cp.php) - Control Panel settings
  - [static_caching.php](config/statamic/static_caching.php) - Static caching configuration

### Custom Extensions

- **[app/Markdown/](app/Markdown/)** - Custom CommonMark renderers for Markdown processing
  - Currently has custom renderers for headings, images, and paragraphs with Tailwind classes
  - Register in [AppServiceProvider.php](app/Providers/AppServiceProvider.php) via `Markdown::addRenderers()`

- **[app/Modifiers/](app/Modifiers/)** - Custom Antlers modifiers (currently empty)
  - Modifiers transform values in templates (e.g., `{{ title | uppercase }}`)

### Frontend

- **Build Tool**: Vite with Laravel plugin
- **CSS Framework**: Tailwind CSS 4.0
- **JavaScript Libraries**:
  - GSAP 3.13.0 - Animation library with ScrollTrigger plugin
  - Lenis - Smooth scroll library with momentum/damping effects
  - Lucide - Icon library
- **Entry Points**:
  - [resources/css/site.css](resources/css/site.css)
  - [resources/js/site.js](resources/js/site.js) - Main JavaScript entry point
  - [resources/js/animations/](resources/js/animations/) - Modular animation files
    - [hero-section.animation.js](resources/js/animations/hero-section.animation.js) - Hero section timeline animations
    - [scroll-animations.js](resources/js/animations/scroll-animations.js) - GSAP ScrollTrigger + Lenis smooth scroll setup

#### Animation Architecture

Animations are organized into separate modules for maintainability:

- **Hero Section Animations** ([hero-section.animation.js](resources/js/animations/hero-section.animation.js)):
  - Sequential timeline-based animations
  - Header fade down
  - Hero title fast fade up
  - Subtitle fade up with letter-by-letter reveal (jittery timing)
  - Project boxes cascading fade up
  - Scoped to hero section only via `#hero-title`, `#hero-subtitle`, `#hero-bottom` IDs

- **Scroll Animations** ([scroll-animations.js](resources/js/animations/scroll-animations.js)):
  - Lenis smooth scroll with damping (`lerp: 0.1` for slippery feel)
  - GSAP ScrollTrigger integration
  - Default trigger: 80% viewport
  - Includes commented examples for future scroll-triggered animations
  - Utility functions: `refreshScrollTriggers()`, `killScrollTriggers()`

**Adding New Animations:**
1. Create new animation module in `resources/js/animations/`
2. Export initialization function
3. Import and call in [resources/js/site.js](resources/js/site.js)
4. Use section-specific IDs or classes to scope animations

### Laravel Standard Structure

- **[app/Http/Controllers/](app/Http/Controllers/)** - Laravel controllers
  - [BlogController.php](app/Http/Controllers/BlogController.php) - Custom API endpoint for blog pagination

- **[routes/web.php](routes/web.php)** - Web routes (use `Route::statamic()` for Statamic routes)

- **[app/Providers/](app/Providers/)** - Service providers
  - Register custom Markdown renderers and other extensions here

## Important Concepts

### Statamic vs Laravel Routing

- Statamic handles most routing automatically based on collection configuration
- Use `Route::statamic('uri', 'template', ['data'])` for custom static routes
- Use standard Laravel routes only for API endpoints or custom controllers

### Collections

- Collections are content types (blogs, pages, projects, etc.)
- Each collection has:
  - A `.yaml` config file defining route patterns, templates, sort order
  - A directory of `.md` files containing the actual entries
  - A blueprint in [resources/blueprints/collections/](resources/blueprints/collections/) defining fields

### Control Panel

- Access at `/cp` (default, configurable in [config/statamic/cp.php](config/statamic/cp.php))
- Create users with: `php please make:user`
- Authenticate to manage content, collections, assets, and settings

### Static Caching

- Configured in [config/statamic/static_caching.php](config/statamic/static_caching.php)
- Currently disabled (`strategy: null`)
- Supports "half measure" (application cache) and "full" (file-based cache)

## Development Workflow

1. **Content Changes**: Edit `.md` files in [content/](content/) or use the Control Panel at `/cp`
2. **Template Changes**: Edit `.antlers.html` files in [resources/views/](resources/views/)
3. **Asset Changes**: CSS/JS changes trigger Vite hot reload when using `composer dev` or `npm run dev`
4. **Collection Structure**: Modify collection `.yaml` files or blueprints in [resources/blueprints/](resources/blueprints/)
5. **Custom Logic**: Add to [app/Http/Controllers/](app/Http/Controllers/), modifiers, or markdown renderers

## Users & Authentication

- Users stored in flat files at [users/](users/)
- Create via: `php please make:user`
- User blueprint: [resources/blueprints/user.yaml](resources/blueprints/user.yaml)
