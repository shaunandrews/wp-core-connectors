<?php
/**
 * Default Connectors.
 *
 * Registers the out-of-the-box connectors that ship with WordPress.
 * Per Matt's directive: Google, OpenAI, Anthropic, OpenRouter, Grok.
 *
 * @package WP_Connectors
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$icons_url = WP_CONNECTORS_URL . 'assets/icons/';

wp_register_connector( 'google', array(
	'name'        => 'Google',
	'description' => 'Connect to Google AI (Gemini) for AI-powered features across your site.',
	'icon'        => $icons_url . 'google.svg',
	'category'    => 'AI',
	'auth_type'   => 'api_key',
	'fields'      => array(
		array(
			'name'        => 'api_key',
			'label'       => 'API Key',
			'type'        => 'password',
			'description' => 'Get a Google AI API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a>. This key enables Gemini models for content generation, translation, and more.',
		),
	),
	'help_url' => 'https://aistudio.google.com/apikey',
) );

wp_register_connector( 'openai', array(
	'name'        => 'OpenAI',
	'description' => 'Connect to OpenAI for GPT-powered content, chat, and image generation.',
	'icon'        => $icons_url . 'openai.svg',
	'category'    => 'AI',
	'auth_type'   => 'api_key',
	'fields'      => array(
		array(
			'name'        => 'api_key',
			'label'       => 'API Key',
			'type'        => 'password',
			'description' => 'Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">OpenAI dashboard</a>. Enables GPT-4, DALL-E, and other OpenAI models.',
		),
	),
	'help_url' => 'https://platform.openai.com/api-keys',
) );

wp_register_connector( 'anthropic', array(
	'name'        => 'Anthropic',
	'description' => 'Connect to Anthropic for Claude-powered content and conversation features.',
	'icon'        => $icons_url . 'anthropic.svg',
	'category'    => 'AI',
	'auth_type'   => 'api_key',
	'fields'      => array(
		array(
			'name'        => 'api_key',
			'label'       => 'API Key',
			'type'        => 'password',
			'description' => 'Get your API key from the <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Anthropic Console</a>. Enables Claude models for content generation, summarization, and analysis.',
		),
	),
	'help_url' => 'https://console.anthropic.com/settings/keys',
) );

wp_register_connector( 'openrouter', array(
	'name'        => 'OpenRouter',
	'description' => 'Connect to OpenRouter for access to multiple AI providers through a single API.',
	'icon'        => $icons_url . 'openrouter.svg',
	'category'    => 'AI',
	'auth_type'   => 'api_key',
	'fields'      => array(
		array(
			'name'        => 'api_key',
			'label'       => 'API Key',
			'type'        => 'password',
			'description' => 'Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">OpenRouter</a>. A single key gives access to models from OpenAI, Anthropic, Google, Meta, and more.',
		),
	),
	'help_url' => 'https://openrouter.ai/keys',
) );

wp_register_connector( 'grok', array(
	'name'        => 'Grok',
	'description' => 'Connect to Grok (xAI) for AI-powered features using the Grok model family.',
	'icon'        => $icons_url . 'grok.svg',
	'category'    => 'AI',
	'auth_type'   => 'api_key',
	'fields'      => array(
		array(
			'name'        => 'api_key',
			'label'       => 'API Key',
			'type'        => 'password',
			'description' => 'Get your API key from the <a href="https://console.x.ai/" target="_blank" rel="noopener">xAI Console</a>. Enables Grok models for content generation and analysis.',
		),
	),
	'help_url' => 'https://console.x.ai/',
) );
