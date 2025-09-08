# Data Model

This document outlines the data models for the TCG website.

## Card

*   **id**: `string` (unique identifier)
*   **name**: `string`
*   **set**: `Relationship` (to Set)
*   **type**: `string` (e.g., "Creature", "Spell", "Item")
*   **cost**: `number`
*   **power**: `number` (for Creature cards)
*   **health**: `number` (for Creature cards)
*   **text**: `string` (card's abilities and flavor text)
*   **image**: `string` (URL to card image)

## Set

*   **id**: `string` (unique identifier)
*   **name**: `string`
*   **releaseDate**: `date`

## Tournament

*   **id**: `string` (unique identifier)
*   **name**: `string`
*   **date**: `date`
*   **results**: `array` of objects:
    *   **rank**: `number`
    *   **playerName**: `string`
    *   **deck**: `Relationship` (to Deck)

## Deck

*   **id**: `string` (unique identifier)
*   **name**: `string`
*   **user**: `Relationship` (to User)
*   **cards**: `array` of `Relationship` (to Card)
*   **isPublic**: `boolean`

## User

*   **id**: `string` (unique identifier, from Discord)
*   **username**: `string` (from Discord)
*   **avatar**: `string` (URL to avatar, from Discord)

## Rules

*   **content**: `richText` (for the rules and FAQ page)
