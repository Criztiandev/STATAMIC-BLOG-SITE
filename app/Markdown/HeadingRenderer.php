<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class HeadingRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        Heading::assertInstanceOf($node);

        $tag = 'h' . $node->getLevel();
        $attrs = $node->data->get('attributes');

        // Add custom Tailwind classes based on heading level
        $classes = match ($node->getLevel()) {
            1 => 'text-4xl font-bold mt-8 mb-4',
            2 => 'text-3xl font-semibold mt-6 mb-3',
            3 => 'text-2xl font-semibold mt-4 mb-2',
            4 => 'text-xl font-semibold mt-3 mb-2',
            5 => 'text-lg font-semibold mt-2 mb-1',
            6 => 'text-base font-semibold mt-2 mb-1',
            default => '',
        };

        $attrs['class'] = $classes;

        return new HtmlElement($tag, $attrs, $childRenderer->renderNodes($node->children()));
    }

    public function getXmlTagName(Node $node): string
    {
        return 'heading';
    }

    public function getXmlAttributes(Node $node): array
    {
        Heading::assertInstanceOf($node);

        return ['level' => $node->getLevel()];
    }
}
