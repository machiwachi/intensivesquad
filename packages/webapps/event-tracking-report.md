# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/page.tsx

- **cta_clicked**: Tracks when a user clicks the main 'Join Team' call-to-action button in the hero section.
- **external_link_clicked**: Tracks when a user clicks the external link to the GitHub repository in the hero section.

### app/leaderboard/(main)/page.tsx

- **leaderboard_clan_viewed**: A user clicked on a clan card on the leaderboard to view its details.

### app/pool/page.tsx

- **ido_reward_claimed**: Tracks when a user clicks the button to claim their IDO rewards.
- **ido_rules_viewed**: Tracks when a user clicks the link to view the detailed rules of the IDO pool.

### app/shrine/page.tsx

- **store_item_purchased**: Fired when a user confirms the purchase of an item from the store.
- **proposal_voted**: Fired when a user casts a vote (yes or no) on an active proposal.

### app/leaderboard/kiosk/page.tsx

- **kiosk_credit_requested**: Tracks when a user clicks the heart button to request credit.
- **kiosk_credit_transactions_received**: Tracks when the API call to get credit is successful and transaction hashes are received.

### components/connect.button.tsx

- **connect-wallet-clicked**: User clicked the button to initiate the wallet connection process.

### app/leaderboard/create-clan.dialog.tsx

- **clan_creation_submitted**: Fired when a user submits the form to create a new clan.
- **clan_creation_cancelled**: Fired when a user clicks the cancel button in the create clan dialog.

### app/leaderboard/clan-detail.dialog.tsx

- **clan_joined**: Fired when a user successfully joins a clan after clicking the 'Join Clan' button.
- **clan_left**: Fired when a user successfully leaves a clan after clicking the 'Leave Clan' button.

### app/leaderboard/rank.button.tsx

- **leaderboard_opened**: Triggered when a user clicks the '排行榜' (Leaderboard) button to open the rankings dialog.

### components/create.button.tsx

- **create_clan_button_clicked**: Tracks when a user clicks the 'Create Clan' button to open the creation dialog.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
