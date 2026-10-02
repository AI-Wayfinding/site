# Privacy policy — draft for Dan's review

**Not approved or published.** This file is a draft. It does not replace the placeholder at `/privacy`.

## DAN TO DECIDE — before publication

- [DAN TO DECIDE: Legal controller name and postal address.]
- [DAN TO DECIDE: Privacy contact address and who handles requests. Confirm whether hello@wayfinding.support is the right address.]
- [DAN TO DECIDE: Governing law, applicable privacy laws and the relevant privacy regulator.]
- [DAN TO DECIDE: Legal basis for each use of personal data, including peer-network updates.]
- [DAN TO DECIDE: Retention periods for contact emails, peer-network interest, accounts, journey history, encrypted files, expired links and sessions, diagnostics, security records and backups.]
- [DAN TO DECIDE: Account and whole-journey deletion process, verification, response time and treatment of shared history and backups. These are not available as self-service features in the reviewed code.]
- [DAN TO DECIDE: Rights-request process, identity checks, response times and complaint route.]
- [DAN TO DECIDE: Minimum age, whether children may use the service and how concerns about children's data will be handled.]
- [DAN TO DECIDE: Contact mailbox provider and any other processors used outside the code.]
- [DAN TO DECIDE: Cloudflare service settings, security logs, Turnstile browser storage and any dashboard-enabled analytics. Verify the live settings before publishing.]
- [DAN TO DECIDE: Where data is processed and stored, and any safeguards needed for international transfers.]
- [DAN TO DECIDE: Effective date and how people will be told about important policy changes.]
- [DAN TO DECIDE: Confirm that the deployed service matches the reviewed code, including whether private-vault storage has since shipped.]

## What matters most

We store journey content in encrypted form. We normally cannot read your notes, documents or attached files. **Agent links are an exception.** If you approve an agent link, our server decrypts journey content in memory to answer requests through that link. The server still sees details such as who is in a journey and when they use it. <!-- Sources: wayfinding-journey/packages/core/src/envelope.ts; wayfinding-journey/packages/core/src/blobs.ts; wayfinding-journey/packages/server/src/agentLink.ts (readJourney, readLink); wayfinding-journey/packages/server/src/registry.ts; wayfinding-journey/packages/server/src/enclave.ts. -->

Your answers to an interview with your own agent go to your own AI provider, under its terms. Wayfinding does not receive those answers unless you choose to add or share them. Messages sent through our contact form are not journey content: we receive them by email. <!-- Sources: wayfinding-site/public/agents/start.md; wayfinding-site/public/agents/interview.md; wayfinding-site/public/agents/install.md; wayfinding-site/src/pages/index.astro; wayfinding-site/worker/index.ts. -->

## Who we are

AI Wayfinding helps people and teams decide whether, where and how AI serves their work. This draft covers `wayfinding.support` and the journey app at `app.wayfinding.support`. <!-- Sources: wayfinding-site/README.md; wayfinding-site/src/pages/index.astro; wayfinding-journey/packages/server/wrangler.jsonc. -->

“We” means [DAN TO DECIDE: Legal controller name and postal address.]. This is the organisation responsible for your personal data. <!-- Editorial gap: neither repository identifies a legal controller or postal address. Sources checked: wayfinding-site/README.md; wayfinding-site/src/components/Footer.astro; wayfinding-journey/README.md. -->

## What we collect and why

### When you contact us

We receive your name, email address, chosen topic and message so we can reply. If you register interest in the peer network, we use those details to contact you about it. The email also includes the time you sent the form and your country, if Cloudflare supplies it. The contact Worker does not save the message in a site database. The email is a separate copy in our mailbox. <!-- Sources: wayfinding-site/src/pages/index.astro (contact form); wayfinding-site/worker/index.ts (contact, email text); wayfinding-site/wrangler.jsonc (no database binding); wayfinding-site/README.md (contact destination). -->

Cloudflare hosts the site and handles form checks. We use your IP address to limit repeated submissions. We send the Turnstile response token and, when available, your IP address to Cloudflare to check for spam. Turnstile is loaded when you open the form. Our verification request does not include your message text. <!-- Sources: wayfinding-site/src/pages/index.astro (loadWidget); wayfinding-site/worker/index.ts (CONTACT_LIMIT, siteverify); wayfinding-site/wrangler.jsonc. -->

### When you sign in to a journey

We keep your email address and an account identifier. We use your address to send sign-in links and connect you with your account. Sign-in and recovery requests use an IP-address hash, a scrambled identifier, to limit repeated attempts. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (email/start, backup-code/redeem); wayfinding-journey/packages/server/src/registry.ts (accounts, tokens, sessions, rates); wayfinding-journey/packages/server/src/crypto.ts. -->

We store passkey identifiers, public keys, device connection types, counters and dates added or last used. A passkey lets your device prove it is yours without giving us its private key. We also store encrypted copies of your journey-access keys so you can unlock them with a passkey. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (passkey registration and authentication); wayfinding-journey/packages/server/src/registry.ts (credentials, sealed_keys); wayfinding-journey/packages/web/src/keys.ts (sealPersonKeys, unlockPersonKeys). -->

You can make eight single-use backup codes. We store a hash used to check each code and encrypted copies of your access keys, not the code itself. Using a code removes its saved check value. Making new codes replaces the old set. Keep your codes safe: someone with one can recover access to your account. <!-- Sources: wayfinding-journey/packages/web/src/keys.ts (newBackupCode, backupKey); wayfinding-journey/packages/web/src/main.ts (backup-code screens); wayfinding-journey/packages/server/src/index.ts (backup-codes, redeem); wayfinding-journey/packages/server/src/registry.ts (backupReplace, backupRedeem). -->

The app sends limited passkey diagnostics to help find sign-in problems. These can include browser version, passkey device type, error name and a short part of an account identifier. The server accepts only specified diagnostic fields. Sign-in email delivery logs can include a message identifier or a shortened error with the recipient address removed. The hosting configuration disables Worker observability; this does not establish a retention period for all security or hosting records. <!-- Sources: wayfinding-journey/packages/web/src/main.ts (passkey diagnostic reporting); wayfinding-journey/packages/server/src/index.ts (diagnosticValues, diagnostics/passkey); wayfinding-journey/packages/server/wrangler.jsonc (observability). -->

### When you use a journey

We store encrypted notes, documents, comments, earlier versions and journey history. We store encrypted attached files in Cloudflare R2, its file-storage service. File names and file types are inside encrypted content. We can still see file sizes and identifiers. <!-- Sources: wayfinding-journey/packages/core/src/envelope.ts; wayfinding-journey/packages/core/src/artifacts.ts; wayfinding-journey/packages/core/src/blobs.ts; wayfinding-journey/packages/web/src/artifacts.ts (uploadAttachment); wayfinding-journey/packages/server/src/enclave.ts; wayfinding-journey/packages/server/wrangler.jsonc. -->

We keep account-to-journey links, the creator's email address, membership identifiers, access roles, public keys, action types, times and storage totals. These details let the server check access and keep the journey history in order. They are not hidden by content encryption. The stored journey name in the account listing is a placeholder; the app reads the actual name from encrypted content. <!-- Sources: wayfinding-journey/packages/server/src/registry.ts (journeys, account_principals); wayfinding-journey/packages/server/src/enclave.ts (principals, log, records); wayfinding-journey/packages/server/src/index.ts (journey creation); wayfinding-journey/packages/web/src/journey.ts (listings); wayfinding-journey/packages/core/src/controlProof.ts. -->

You can choose to show your email address to people in a journey. Your journey profile name and that shared address are part of encrypted journey content. People with access can read them. An approved agent link can show them too. <!-- Sources: wayfinding-journey/packages/web/src/main.ts (membersScreen, show-my-email); wayfinding-journey/packages/core/src/controlProof.ts (member.profile); wayfinding-journey/packages/server/src/agentLink.ts (who, people). -->

If you send an invitation by email, the server receives the recipient's address and sends the invitation through Cloudflare. It stores the invitation's hashed identifier, expiry and acceptance details. It does not need your journey's text to send the invitation. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (journeys/:id/invites); wayfinding-journey/packages/server/src/registry.ts (invites, pending_principals); wayfinding-journey/packages/server/src/email.ts. -->

When an agent asks to join, we store its public keys, name, requested access, approval code and approval status. If you approve it, we store its allowed access and expiry, and whether it uses memory, a session file or a link for its keys. These details let us check signed requests and your approval. Ordinary agent access lasts at most eight hours; remembered access can last up to ninety days. These limits do not erase the stored approval records. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (agent-sessions); wayfinding-journey/packages/server/src/registry.ts (agent_sessions); wayfinding-journey/packages/web/src/main.ts (agentScreen); wayfinding-journey/packages/client/src/connection.ts. -->

### What stays on your device

The app saves encrypted access keys and a key that unlocks that local copy in your browser's storage. This lets you stay signed in between visits. The account name you enter is also encrypted in that browser storage. Signing out removes the saved keys and clears unlocked keys in the page. Use sign-out on a shared device. <!-- Sources: wayfinding-journey/packages/web/src/keys.ts (SavedKeys, unlockPersonKeys, setAccountName, clearPersonKeys); wayfinding-journey/packages/web/src/main.ts (logout). -->

The browser also keeps temporary journey identifiers, invitation information and your project-filter choice for the current browser session. <!-- Sources: wayfinding-journey/packages/web/src/journey.ts (listings); wayfinding-journey/packages/web/src/main.ts (sessionStorage). -->

The agent client normally keeps its access keys in memory. If you approve remembered access, it saves them in your computer's keychain or in a file encrypted with your chosen passphrase. A session state file is different: it holds keys without encryption, with access restricted to your operating-system user. It permits at most eight hours of access and is deleted when the client next loads it after expiry. The client can also save an optional local cache of encrypted journey content. These copies are not a Wayfinding server database. <!-- Sources: wayfinding-journey/packages/client/src/connection.ts; wayfinding-journey/packages/client/src/storage.ts; wayfinding-journey/packages/client/src/state.ts; wayfinding-journey/packages/client/src/cache.ts; wayfinding-journey/packages/client/src/cli.ts. -->

## What we cannot normally see

Content encryption happens on your device or in the agent client before content is stored. The server holds encrypted content and encrypted key copies, not the keys needed to open them during ordinary use. Encryption does not hide the access and activity details described above. <!-- Sources: wayfinding-journey/packages/core/src/envelope.ts; wayfinding-journey/packages/core/src/blobs.ts; wayfinding-journey/packages/web/src/journey.ts; wayfinding-journey/packages/web/src/keys.ts; wayfinding-journey/packages/client/src/journey.ts; wayfinding-journey/packages/server/src/enclave.ts. -->

People and agents you admit can read content within their access. They may keep copies. Removing someone cannot recall a copy they have already downloaded. A journey recovery key is also sensitive: anyone who has it and the encrypted material it opens can read that material. <!-- Sources: wayfinding-journey/packages/core/src/removal.ts; wayfinding-journey/packages/core/src/teamKey.ts; wayfinding-journey/packages/web/src/main.ts (recovery screen, exportScreen); wayfinding-site/public/agents/install.md. -->

The browser app also depends on the code we serve. Whoever serves it could change what it does. Encryption is not proof that the running app matches this repository. <!-- Sources: wayfinding-journey/README.md (served-code limit); wayfinding-journey/packages/server/src/index.ts (ASSETS.fetch); wayfinding-journey/packages/web/src/journey.ts. -->

## The agent-link exception

An agent link gives read-only access to an agent that can fetch a web page. Anyone holding the link can use it until it expires or the agent is removed. On each request, the server opens the agent's saved encrypted identity and decrypts the journey in memory. It sends readable journey information through the link. This is an exception to end-to-end encryption, not ordinary encrypted storage. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (/a/:secret, agent-links); wayfinding-journey/packages/server/src/agentLink.ts (readJourney, readLink); wayfinding-journey/packages/core/src/link.ts. -->

The link handler does not store or log the decrypted content. Its responses tell caches not to store them. It shows journey text, people and project details, but does not offer attachment downloads or show recovery entries. The server still processes readable content in memory. Your AI provider receives what your agent reads, under that provider's terms. <!-- Sources: wayfinding-journey/packages/server/src/agentLink.ts (LINK_HEADERS, readLink, recovery filter, attachments notice); wayfinding-journey/packages/server/src/index.ts (/a/:secret error handling); wayfinding-site/public/agents/install.md. -->

The browser offers links lasting one, seven or thirty days. You can extend a link with your passkey or remove its agent in “People & agents”. We store the link's hashed identifier, encrypted agent identity, journey and member identifiers, expiry and rate-limit counters. Link expiry stops access; it is not a promise that every related record is erased then. <!-- Sources: wayfinding-journey/packages/web/src/main.ts (membersScreen, agent-link-form, renew); wayfinding-journey/packages/server/src/registry.ts (agent_links, linkRevoke); wayfinding-journey/packages/server/src/index.ts (agent-links, /a/:secret). -->

## Who handles data for us

Cloudflare hosts both services. Its Workers run our code, Durable Objects hold account and journey records, R2 holds encrypted attached files, and its email service sends contact, sign-in and invitation emails. Cloudflare Turnstile checks the contact form for spam. <!-- Sources: wayfinding-site/wrangler.jsonc; wayfinding-site/worker/index.ts; wayfinding-journey/packages/server/wrangler.jsonc; wayfinding-journey/packages/server/src/index.ts; wayfinding-journey/packages/server/src/enclave.ts. -->

Contact emails reach our mailbox. [DAN TO DECIDE: Contact mailbox provider and any other processors used outside the code.] Your own email provider receives sign-in and invitation messages. Your own AI provider receives your agent conversations and content you let the agent read; the code does not choose a single AI provider for you. <!-- Sources: wayfinding-site/README.md (private CONTACT_TO); wayfinding-site/worker/index.ts; wayfinding-site/public/agents/start.md; wayfinding-site/public/agents/install.md; wayfinding-journey/packages/server/src/index.ts (MAGIC_EMAIL). -->

[DAN TO DECIDE: Where data is processed and stored, and any safeguards needed for international transfers.] The repositories identify Cloudflare services, but do not establish every processing location or contract. <!-- Sources checked: wayfinding-site/wrangler.jsonc; wayfinding-journey/packages/server/wrangler.jsonc. -->

## Cookies and analytics

The journey app uses a sign-in cookie with a maximum age of thirty days and a short passkey sign-in cookie lasting five minutes. They are restricted to the app's API paths. Signing out clears the sign-in cookie and removes its server session. A backup-code recovery session is valid for ten minutes even though its cookie has the normal maximum age. <!-- Sources: wayfinding-journey/packages/server/src/index.ts (cookie, discoveryCookie, logout, backup-code/redeem); wayfinding-journey/packages/server/src/registry.ts (backupRedeem, session). -->

The website code does not set its own cookies or include an analytics script. Fonts are served from the site. Both services ask Cloudflare not to alter pages, including by adding an analytics beacon. Turnstile loads Cloudflare's own script when you open the contact form. [DAN TO DECIDE: Cloudflare service settings, security logs, Turnstile browser storage and any dashboard-enabled analytics. Verify the live settings before publishing.] <!-- Sources reviewed: wayfinding-site/src/layouts/Base.astro; wayfinding-site/src/pages/index.astro; wayfinding-site/public/_headers; wayfinding-journey/packages/web/index.html; wayfinding-journey/packages/server/src/index.ts (notFound); wayfinding-site/wrangler.jsonc; wayfinding-journey/packages/server/wrangler.jsonc. No claim is made about unseen dashboard settings. -->

## How long we keep data

[DAN TO DECIDE: Retention periods for contact emails, peer-network interest, accounts, journey history, encrypted files, expired links and sessions, diagnostics, security records and backups.] We have not set those periods in this draft. <!-- Sources checked: wayfinding-site/worker/index.ts; wayfinding-journey/packages/server/src/registry.ts; wayfinding-journey/packages/server/src/enclave.ts. No general retention schedule is defined there. -->

Some access limits are set in code. Email sign-in links expire after fifteen minutes. Passkey challenges expire after five minutes. Invitations can last up to seven days. Ordinary server sessions last thirty days. These are access limits, not general erasure dates. <!-- Sources: wayfinding-journey/packages/server/src/registry.ts (emailStart, challengeSet, sessions); wayfinding-journey/packages/server/src/index.ts (invites). -->

Unfinished file uploads expire after one hour. A background task removes expired uncommitted uploads and files no longer referenced by live artifacts. It retries if storage deletion fails. That cleanup does not erase the signed history or all encrypted earlier text. <!-- Sources: wayfinding-journey/packages/server/src/enclave.ts (blobBegin, alarm, artifactWrite); wayfinding-journey/packages/rules/rules.bend (blob_collect); wayfinding-journey/packages/web/src/main.ts (exportScreen). -->

## Your choices, rights and deletion

You can review and replace passkeys in Account, make new backup codes, choose whether to show your email in each journey, and remove your own agents in “People & agents”. You can leave a journey when its access rules allow it. You can export journey content you have access to in an encrypted download. <!-- Sources: wayfinding-journey/packages/web/src/main.ts (accountScreen, membersScreen, exportScreen); wayfinding-journey/packages/web/src/journey.ts (exportEncrypted); wayfinding-journey/packages/core/src/removal.ts. -->

Deleting an artifact removes it from the current views. It does not erase its signed history or encrypted metadata. Old file copies may be cleaned up by the background task. Copies already downloaded by other people or providers are outside that cleanup. <!-- Sources: wayfinding-journey/packages/web/src/artifacts.ts (deleteArtifact, artifactViews); wayfinding-journey/packages/server/src/enclave.ts (artifactWrite, alarm); wayfinding-journey/packages/core/src/transfer.ts; wayfinding-journey/packages/web/src/main.ts (exportScreen). -->

The reviewed app does not offer self-service deletion of an account or a whole journey. Leaving a journey and signing out are not account deletion. [DAN TO DECIDE: Account and whole-journey deletion process, verification, response time and treatment of shared history and backups. These are not available as self-service features in the reviewed code.] <!-- Sources reviewed: wayfinding-journey/packages/server/src/index.ts (all HTTP routes); wayfinding-journey/packages/server/src/registry.ts (an internal journeyDelete operation exists, but no public route invokes it); wayfinding-journey/packages/web/src/main.ts (Account and journey screens). -->

Depending on the law that applies, you may have rights to see, correct, receive a copy of, or ask us to delete your personal data. You may also have rights to restrict or object to its use. To ask about your data, contact [DAN TO DECIDE: Privacy contact address and who handles requests. Confirm whether hello@wayfinding.support is the right address.]. [DAN TO DECIDE: Rights-request process, identity checks, response times and complaint route.] <!-- Editorial legal gaps, not implemented service guarantees. Sources checked for current controls and contact: wayfinding-journey/packages/server/src/index.ts; wayfinding-site/src/pages/privacy.astro. -->

[DAN TO DECIDE: Legal basis for each use of personal data, including peer-network updates.] [DAN TO DECIDE: Governing law, applicable privacy laws and the relevant privacy regulator.] These decisions must be made before the rights and complaint wording is final. <!-- Editorial legal gaps: not established by either repository's code. -->

## Children

[DAN TO DECIDE: Minimum age, whether children may use the service and how concerns about children's data will be handled.] The reviewed sign-in and contact forms do not ask for an age. This draft does not claim that age checks are in place. <!-- Sources: wayfinding-site/src/pages/index.astro (contact form); wayfinding-journey/packages/web/src/main.ts (sign-in and registration); wayfinding-journey/packages/server/src/index.ts (auth routes). -->

## Changes and contact

[DAN TO DECIDE: Effective date and how people will be told about important policy changes.] <!-- Editorial gap: wayfinding-site/src/pages/privacy.astro is still a placeholder; no policy-change notice process is implemented. -->

For privacy questions, contact [DAN TO DECIDE: Privacy contact address and who handles requests. Confirm whether hello@wayfinding.support is the right address.]. The current website lists `hello@wayfinding.support` for questions. <!-- Source: wayfinding-site/src/pages/privacy.astro. -->

## Verification notes — remove before publishing

Sources were reviewed at `wayfinding-site` base `39868af` and `wayfinding-journey` HEAD `6b6a76d`. Paths in comments start with the repository name. This is a source review, not a check of production configuration. <!-- Sources: Git HEADs recorded during this review; wayfinding-site/README.md; wayfinding-journey/packages/server/wrangler.jsonc. -->

The planned per-member private vault is not implemented in the reviewed server, browser or agent-client source. This draft makes no promise about private-vault storage or padding. [DAN TO DECIDE: Confirm that the deployed service matches the reviewed code, including whether private-vault storage has since shipped.] <!-- Sources reviewed: wayfinding-journey/packages/server/src/index.ts; wayfinding-journey/packages/server/src/enclave.ts; wayfinding-journey/packages/server/src/types.ts; wayfinding-journey/packages/web/src/artifacts.ts; wayfinding-journey/packages/client/src/journey.ts. Plans: wayfinding-journey/.work/drafts/stage-3-private-artifacts.md; a plan is not proof of a shipped data flow. -->
