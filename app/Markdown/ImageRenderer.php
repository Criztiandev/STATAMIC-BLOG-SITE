<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Inline\Image;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class ImageRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        Image::assertInstanceOf($node);

        $attrs = $node->data->get('attributes');
        $attrs['src'] = $node->getUrl();
        $attrs['alt'] = $childRenderer->renderNodes($node->children());

        // Add custom Tailwind classes
        $attrs['class'] = 'w-full rounded-lg my-8 shadow-lg';

        if ($node->getTitle() !== null) {
            $attrs['title'] = $node->getTitle();
        }

        return new HtmlElement('img', $attrs, '', true);
    }

    public function getXmlTagName(Node $node): string
    {
        return 'image';
    }

    public function getXmlAttributes(Node $node): array
    {
        Image::assertInstanceOf($node);

        return [
            'destination' => $node->getUrl(),
            'title' => $node->getTitle() ?? '',
        ];
    }
}
