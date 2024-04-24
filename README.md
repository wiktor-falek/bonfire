# Bonfire - browser chat application

A Discord like chatting application built for the sake of learning and experimenting.

## Features

### Auth

- [x] Email authentication
- [ ] Account verification email
- [ ] 2FA
- [ ] Logout
- [ ] Logout from all devices

### Profile

- [x] Updating status (Online, Away, Dnd, Offline), dispatched to subscribing users in real time
- [ ] Appear offline when all devices are disconnected (display the persisted status on going online)
- [ ] Updating display name
- [ ] About me

### User relations

- [x] Friend invite by username
- [ ] Friend invite by id (by clicking in the users profile)
- [ ] Removing a friend
- [x] Accepting a friend request
- [x] Rejecting a friend request
- [x] Creating friend relationship when both users invite each other
- [x] Creating block relationship when one user blocks the other one
- [ ] Ignoring incoming messages, friend requests from blocked users
- [ ] Dispatching invites/accepts/blocks
- [ ] Notifications on friend invite when not in pending friend requests view

### Messages

- [x] Exchanging direct messages between users

### Servers

- [ ] Creating a server
- [ ] Deleting a server
- [ ] Creating and deleting message channels
- [ ] Inviting other users
- [ ] Permissions

### Notifications

- [ ] Unread messages

## Technologies used

### Backend:

- Express
- Node WebSocket Client (custom API with different kinds of emits and namespaces)
- MongoDB
- Redis (session management and caching)

### Frontend:

- Vue 3
- CSS
- WebSocket API

## External dependencies

- NodeJS v20.11.1 LTS
- MongoDB
- Redis

## Running the project locally

See [Frontend README.md](./frontend/README.md) and [Server README.md](./server/README.md)
for instructions on running the project locally
