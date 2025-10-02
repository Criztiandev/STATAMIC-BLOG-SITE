<?php

namespace App\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use League\CommonMark\Xml\XmlNodeRendererInterface;

class ParagraphRenderer implements NodeRendererInterface, XmlNodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): \Stringable
    {
        Paragraph::assertInstanceOf($node);

        $attrs = $node->data->get('attributes');

        // Add custom Tailwind classes
        $attrs['class'] = 'text-gray-700 leading-relaxed mb-6';

        return new HtmlElement('p', $attrs, $childRenderer->renderNodes($node->children()));
    }

    public function getXmlTagName(Node $node): string
    {
        return 'paragraph';
    }

    public function getXmlAttributes(Node $node): array
    {
        return [];
    }
}
