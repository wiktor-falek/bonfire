# Bonfire - browser chat application

A Discord like chatting application built for the sake of learning and experimenting.

## TODO
- [ ] /verify page - success view with link to home page, error view with reason
- [ ] /friends page - responsive design for mobile
- [ ] /friends page - Add Friend styling
- [ ] Finish appearing offline when all devices are disconnected (display the persisted status on going online)
- [ ] Redis adapter for WebSocket

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

### Profile

- [x] Updating status (Online, Away, Dnd, Offline), dispatched to subscribing users in real time
- [ ] Updating display name
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

## External dependencies

- NodeJS v20.11.1 LTS
- MongoDB
- Redis

## Running the project locally

See [Frontend README.md](./frontend/README.md) and [Server README.md](./server/README.md)
for instructions on running the project locally
