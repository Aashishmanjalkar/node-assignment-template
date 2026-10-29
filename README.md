
# Bid Assignment

## Setup

1. `cd src`
2. `npm install`
3. `npm run dev`

## What's included

This project includes:
- Express server setup
- POST `/bid` API
- Sequelize ORM with PostgreSQL
- Database models for users, auctions, and bids
- Bid validation and auction expiry checks
- Unique constraint on `(auction_id, user_id, amount)` to prevent duplicate bids and support idempotency.
- Pessimistic locking to handle simultaneous bids

## Bidding Rules

- The first bid must meet the auction's minimum price.
- Each new bid must be higher than the current highest bid.
- The highest bidder can bid again with a higher amount.
- Bids are not allowed after the auction expires.
- Only one bid at a time can be processed for the same auction.
