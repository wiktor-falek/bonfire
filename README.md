# Bonfire - browser chat application

A Discord inspired chatting application built for the sake of learning and experimenting.

LIVE LINK: https://bonfire.hericium.pro

## BUGS

- [ ] display name disappearing in user card and DMs when updated

## TODO

- [x] Change display name
  - [x] Default to username on inputting 0 length display name
  - [ ] Show the updated display name everywhere (DM Channel title, Friends, your own User Card)
- [x] Map user id to name from profile store
- [ ] Chat features
  - [ ] Deleting your messages
    - [ ] Emit to remove existing messages in clients states
  - [ ] Multiline text input
- [ ] Removing a Friend
- [ ] Notification on DM while the DM channel is not open
- [ ] Update Friends changes in real time
- [ ] Notifications for new Pending friend
- [ ] Profile pictures - default and custom
- [ ] Profile click closing modal when modal is open
- [ ] Profile modal styling
- [ ] Finish appearing offline when all devices are disconnected
- [ ] /friends page - Add Friend styling
- [ ] /friends page - responsive design for mobile
- [ ] Add/Pending/Remove friend in DMs
- [ ] Get rid of console errors
- [ ] Add friend and send message from my account to whoever signs up (Chingu reviewer onboarding)

## Future TODO

- [ ] /verify page - success view with link to home page, error view with reason
- [ ] Redis adapter for WebSocket
- [ ] Socket reconnect mechanism - get up to date state

## Features

### Auth

- [x] Registration
- [x] Automatic login on registration
- [x] Email authentication
- [ ] 2FA
- [ ] Logout
- [ ] Logout from all devices

### Email

- [x] Sending account verification email
- [x] Verifying email by clicking a link
- [ ] Sending email verification to a different email
- [ ] Changing email
- [ ] Account recovery

### Realtime Updates

- [x] A two way mapping where each subscriber tracks the profiles they are subscribed to, and each profile tracks the subscribers subscribed to it
- [x] Multiple devices per user
- [x] Subscribing to profiles of users when shown on screen
- [x] Dispatching real time events (e.g. status and display name updates) to all active devices of a user

### Profile

- [x] Updating status (Online, Away, Dnd, Offline), dispatched to subscribing users in real time
- [x] Updating display name
- [ ] About me section

### User relations

- [x] Friend invite by username
- [ ] Friend invite by id (by clicking on a user profile)
- [ ] Removing a friend
- [x] Accepting a friend request
- [x] Rejecting a friend request
- [x] Creating friend relationship when both users invite each other
- [x] Creating block relationship when one user blocks the other one
- [ ] Ignoring incoming messages and friend requests from blocked users
- [ ] Dispatching invites/accepts/blocks in real time
- [ ] Notifications on friend invite when outside of pending friend requests UI

### Messages

- [x] Exchanging direct messages between users
- [ ] File uploads
- [ ] Emojis
- [ ] Reactions

### Voice Chat

- [ ] Voice call between two users

### Servers

- [ ] Creating a server
- [ ] Deleting a server
- [ ] Creating and deleting message channels
- [ ] Inviting other users
- [ ] Permissions

### Notifications

- [ ] Unread messages
- [ ] Friend requests

## Technologies used

### Backend:

- Express
- Node WebSocket Client (custom API with namespaces and different emits)
- MongoDB
- Redis (managing sessions, caching in the future)

### Frontend:

- Vue 3
- CSS
- Pinia
- WebSocket API

## Required system level dependencies

- NodeJS 18+
- MongoDB (latest)
- Redis (latest)

## Running the project locally

See [Frontend README.md](./frontend/README.md) and [Server README.md](./server/README.md)
for instructions on running the project locally
