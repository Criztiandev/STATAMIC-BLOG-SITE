# Statamic Markdown Customization Guide

## Overview
This guide explains how to customize Markdown rendering in Statamic by creating custom renderers that add Tailwind CSS classes to HTML elements.

## How It Works

### 1. The Flow
```
Markdown Content → Statamic Parser → Custom Renderers → HTML with Custom Classes
```

### 2. Architecture
- **Custom Renderers**: PHP classes that control how Markdown elements are converted to HTML
- **AppServiceProvider**: Registers the custom renderers
- **CommonMark**: The underlying Markdown parser library used by Statamic

---

## Creating Custom Renderers

### Basic Renderer Structure

All custom renderers must implement:
- `NodeRendererInterface` - Required for rendering
- `XmlNodeRendererInterface` - Required for XML output

```php
<?php

namespace App\Markdown;

use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class CustomRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        // Your custom rendering logic here
    }

    public function getXmlTagName(Node $node): string
    {
        // Return XML tag name
    }

    public function getXmlAttributes(Node $node): array
    {
        // Return XML attributes
    }
}
```

---

## Available Renderers

### 1. Image Renderer

**File**: `app/Markdown/ImageRenderer.php`

**Customizes**: Images from `![alt](url)`

**Example**:
```php
// Add custom classes
$attrs['class'] = 'w-full rounded-lg my-8 shadow-lg';

// Access image properties
$attrs['src'] = $node->getUrl();
$attrs['alt'] = $childRenderer->renderNodes($node->children());
$attrs['title'] = $node->getTitle(); // Optional title
```

**Customize**:
```php
// Make images smaller
$attrs['class'] = 'max-w-md mx-auto rounded-lg my-4';

// Add border
$attrs['class'] = 'w-full border-4 border-gray-300 rounded-xl';

// Add loading attribute
$attrs['loading'] = 'lazy';
```

---

### 2. Heading Renderer

**File**: `app/Markdown/HeadingRenderer.php`

**Customizes**: Headings from `# H1` to `###### H6`

**Example**:
```php
// Different classes per level
$classes = match ($node->getLevel()) {
    1 => 'text-4xl font-bold mt-8 mb-4',
    2 => 'text-3xl font-semibold mt-6 mb-3',
    3 => 'text-2xl font-semibold mt-4 mb-2',
    // ...
};
```

**Customize**:
```php
// Add colored headings
$classes = match ($node->getLevel()) {
    1 => 'text-5xl font-black text-blue-600 mb-6',
    2 => 'text-4xl font-bold text-blue-500 mb-4',
    3 => 'text-3xl font-semibold text-blue-400 mb-3',
};

// Add underline to H1
if ($node->getLevel() === 1) {
    $classes .= ' border-b-2 border-gray-200 pb-2';
}

// Add IDs for anchor links
$attrs['id'] = strtolower(str_replace(' ', '-', $childRenderer->renderNodes($node->children())));
```

---

### 3. Paragraph Renderer

**File**: `app/Markdown/ParagraphRenderer.php`

**Customizes**: Paragraphs from regular text

**Example**:
```php
$attrs['class'] = 'text-gray-700 leading-relaxed mb-6';
```

**Customize**:
```php
// Larger text
$attrs['class'] = 'text-lg text-gray-800 leading-loose mb-8';

// Justified text
$attrs['class'] = 'text-justify text-gray-700 leading-relaxed mb-6';

// First paragraph special styling (requires logic)
// Note: You'd need to track if it's the first paragraph
$attrs['class'] = 'text-xl font-medium text-gray-900 mb-8';
```

---

## Creating Additional Renderers

### Link Renderer

**Create**: `app/Markdown/LinkRenderer.php`

```php
<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class LinkRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        Link::assertInstanceOf($node);

        $attrs = $node->data->get('attributes');
        $attrs['href'] = $node->getUrl();

        // Add custom classes
        $attrs['class'] = 'text-blue-600 hover:text-blue-800 underline transition-colors';

        // External links open in new tab
        if (str_starts_with($node->getUrl(), 'http')) {
            $attrs['target'] = '_blank';
            $attrs['rel'] = 'noopener noreferrer';
        }

        return new HtmlElement('a', $attrs, $childRenderer->renderNodes($node->children()));
    }

    public function getXmlTagName(Node $node): string
    {
        return 'link';
    }

    public function getXmlAttributes(Node $node): array
    {
        Link::assertInstanceOf($node);
        return ['destination' => $node->getUrl(), 'title' => $node->getTitle() ?? ''];
    }
}
```

**Register**:
```php
use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
Markdown::addRenderer(Link::class, new LinkRenderer());
```

---

### List Renderer

**Create**: `app/Markdown/ListRenderer.php`

```php
<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\ListBlock;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class ListRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        ListBlock::assertInstanceOf($node);

        $attrs = $node->data->get('attributes');

        // Different classes for ordered vs unordered
        if ($node->getListData()->type === ListBlock::TYPE_BULLET) {
            $attrs['class'] = 'list-disc list-inside space-y-2 my-4';
            $tag = 'ul';
        } else {
            $attrs['class'] = 'list-decimal list-inside space-y-2 my-4';
            $tag = 'ol';
        }

        return new HtmlElement($tag, $attrs, $childRenderer->renderNodes($node->children()));
    }

    public function getXmlTagName(Node $node): string
    {
        return 'list';
    }

    public function getXmlAttributes(Node $node): array
    {
        ListBlock::assertInstanceOf($node);
        return ['type' => $node->getListData()->type];
    }
}
```

**Register**:
```php
use League\CommonMark\Extension\CommonMark\Node\Block\ListBlock;
Markdown::addRenderer(ListBlock::class, new ListRenderer());
```

---

### Blockquote Renderer

**Create**: `app/Markdown/BlockquoteRenderer.php`

```php
<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class BlockquoteRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        BlockQuote::assertInstanceOf($node);

        $attrs = $node->data->get('attributes');
        $attrs['class'] = 'border-l-4 border-blue-500 pl-6 italic text-gray-600 my-6 py-2';

        return new HtmlElement('blockquote', $attrs, $childRenderer->renderNodes($node->children()));
    }

    public function getXmlTagName(Node $node): string
    {
        return 'block_quote';
    }

    public function getXmlAttributes(Node $node): array
    {
        return [];
    }
}
```

**Register**:
```php
use League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote;
Markdown::addRenderer(BlockQuote::class, new BlockquoteRenderer());
```

---

### Code Block Renderer

**Create**: `app/Markdown/CodeBlockRenderer.php`

```php
<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class CodeBlockRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        FencedCode::assertInstanceOf($node);

        $attrs = ['class' => 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6'];

        $codeAttrs = [];
        if ($node->getInfo()) {
            $codeAttrs['class'] = 'language-' . $node->getInfo();
        }

        $code = new HtmlElement('code', $codeAttrs, htmlspecialchars($node->getLiteral()));
        return new HtmlElement('pre', $attrs, $code);
    }

    public function getXmlTagName(Node $node): string
    {
        return 'code_block';
    }

    public function getXmlAttributes(Node $node): array
    {
        FencedCode::assertInstanceOf($node);
        return ['info' => $node->getInfo() ?? ''];
    }
}
```

**Register**:
```php
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
Markdown::addRenderer(FencedCode::class, new CodeBlockRenderer());
```

---

## Registration in AppServiceProvider

**File**: `app/Providers/AppServiceProvider.php`

```php
<?php

namespace App\Providers;

use App\Markdown\BlockquoteRenderer;
use App\Markdown\CodeBlockRenderer;
use App\Markdown\HeadingRenderer;
use App\Markdown\ImageRenderer;
use App\Markdown\LinkRenderer;
use App\Markdown\ListRenderer;
use App\Markdown\ParagraphRenderer;
use Illuminate\Support\ServiceProvider;
use League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\ListBlock;
use League\CommonMark\Extension\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Extension\CommonMark\Node\Inline\Image;
use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
use Statamic\Facades\Markdown;
use Statamic\Statamic;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register all custom renderers
        Markdown::addRenderer(Image::class, new ImageRenderer());
        Markdown::addRenderer(Heading::class, new HeadingRenderer());
        Markdown::addRenderer(Paragraph::class, new ParagraphRenderer());
        Markdown::addRenderer(Link::class, new LinkRenderer());
        Markdown::addRenderer(ListBlock::class, new ListRenderer());
        Markdown::addRenderer(BlockQuote::class, new BlockquoteRenderer());
        Markdown::addRenderer(FencedCode::class, new CodeBlockRenderer());
    }
}
```

---

## Advanced Techniques

### 1. Conditional Styling

```php
public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
{
    Image::assertInstanceOf($node);

    $attrs = $node->data->get('attributes');
    $url = $node->getUrl();

    // Different styles based on image source
    if (str_contains($url, 'thumbnail')) {
        $attrs['class'] = 'w-32 h-32 object-cover rounded-full';
    } elseif (str_contains($url, 'banner')) {
        $attrs['class'] = 'w-full h-64 object-cover';
    } else {
        $attrs['class'] = 'w-full rounded-lg shadow-lg';
    }

    $attrs['src'] = $url;
    $attrs['alt'] = $childRenderer->renderNodes($node->children());

    return new HtmlElement('img', $attrs, '', true);
}
```

### 2. Adding Data Attributes

```php
$attrs['data-aos'] = 'fade-up'; // Animation on scroll
$attrs['data-lightbox'] = 'gallery'; // Lightbox galleries
```

### 3. Wrapping Elements

```php
// Wrap image in a figure with caption
$img = new HtmlElement('img', $imgAttrs, '', true);
$caption = new HtmlElement('figcaption', ['class' => 'text-center text-sm text-gray-600 mt-2'], $node->getTitle());
return new HtmlElement('figure', ['class' => 'my-8'], $img . $caption);
```

---

## Common Node Types Reference

| Markdown Element | Node Class | Import Path |
|-----------------|------------|-------------|
| Heading | `Heading` | `League\CommonMark\Extension\CommonMark\Node\Block\Heading` |
| Paragraph | `Paragraph` | `League\CommonMark\Extension\CommonMark\Node\Block\Paragraph` |
| Link | `Link` | `League\CommonMark\Extension\CommonMark\Node\Inline\Link` |
| Image | `Image` | `League\CommonMark\Extension\CommonMark\Node\Inline\Image` |
| List | `ListBlock` | `League\CommonMark\Extension\CommonMark\Node\Block\ListBlock` |
| Blockquote | `BlockQuote` | `League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote` |
| Code Block | `FencedCode` | `League\CommonMark\Extension\CommonMark\Node\Block\FencedCode` |
| Inline Code | `Code` | `League\CommonMark\Extension\CommonMark\Node\Inline\Code` |
| Strong | `Strong` | `League\CommonMark\Extension\CommonMark\Node\Inline\Strong` |
| Emphasis | `Emphasis` | `League\CommonMark\Extension\CommonMark\Node\Inline\Emphasis` |

---

## Testing Your Renderers

1. **Clear cache**:
   ```bash
   php artisan cache:clear
   ```

2. **View your content** in the browser

3. **Inspect HTML** with browser DevTools to verify classes are applied

4. **Debug**: Add `dd()` in renderer to inspect node data:
   ```php
   dd($node, $attrs, $childRenderer->renderNodes($node->children()));
   ```

---

## Tips & Best Practices

1. **Keep renderers focused**: One renderer per element type
2. **Use Tailwind classes**: Easy to customize and maintain
3. **Test with real content**: Use actual blog posts to test all elements
4. **Consider mobile**: Ensure classes are responsive
5. **Document your classes**: Add comments explaining custom styling choices
6. **Version control**: Commit renderers separately for easy rollback

---

## Resources

- [Statamic Markdown Docs](https://statamic.dev/extending/markdown)
- [CommonMark PHP Docs](https://commonmark.thephpleague.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)

---

## Quick Reference

**Add a new renderer:**
1. Create renderer class in `app/Markdown/`
2. Implement `NodeRendererInterface` and `XmlNodeRendererInterface`
3. Add rendering logic in `render()` method
4. Register in `AppServiceProvider::boot()`
5. Clear cache and test

**Modify existing renderer:**
1. Edit the renderer file
2. Change the `$attrs['class']` value
3. Clear cache
4. Refresh browser
