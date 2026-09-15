# Tarang API — explained simply

Think of the backend as a restaurant kitchen, and the API as the menu the
frontend (the dining room) orders from. Each line below is one "dish":
what to ask for, what you need to bring (if anything), and what comes back.

`🔒` means you must be logged in (send your login token) to order this dish.

## Account

| What you want to do        | Ask for (Method + URL)         | Send                          | You get back                     |
|-----------------------------|----------------------------------|--------------------------------|------------------------------------|
| Create an account            | `POST /api/auth/register`        | name, email, password          | your new profile + a login token   |
| Log in                       | `POST /api/auth/login`           | email, password                | your profile + a login token       |
| See my own profile          | 🔒 `GET /api/auth/me`            | nothing                        | your profile                       |

## Browsing & searching music

| What you want to do             | Ask for                         | Send                | You get back                  |
|-----------------------------------|------------------------------------|------------------------|----------------------------------|
| See all songs                     | `GET /api/songs`                   | nothing (optional `?genre=Rock`) | list of songs           |
| Get songs picked for me          | `GET /api/songs/recommended`       | nothing (token optional) | a personalized list         |
| Search for a song                 | `GET /api/songs/search?q=kadhal`   | nothing                | matching songs                  |
| Open one song's page              | `GET /api/songs/:id`               | nothing                | that song's details              |
| Count a play (when streaming starts) | `PUT /api/songs/:id/play`       | nothing                | updated play count              |
| Like / unlike a song              | 🔒 `PUT /api/songs/:id/like`       | nothing                | whether it's now liked          |

## Playlists

| What you want to do          | Ask for                                     | Send                       | You get back           |
|--------------------------------|------------------------------------------------|--------------------------------|---------------------------|
| See my playlists              | 🔒 `GET /api/playlists/mine`                   | nothing                        | all your playlists       |
| Open one playlist             | `GET /api/playlists/:id`                        | nothing                        | that playlist + its songs |
| Create a playlist             | 🔒 `POST /api/playlists`                        | name, description (optional)   | the new playlist          |
| Rename / edit a playlist      | 🔒 `PUT /api/playlists/:id`                     | any fields to change           | the updated playlist      |
| Add a song to a playlist      | 🔒 `PUT /api/playlists/:id/songs/:songId`       | nothing                        | the updated playlist      |
| Remove a song from a playlist | 🔒 `DELETE /api/playlists/:id/songs/:songId`    | nothing                        | the updated playlist      |
| Delete a playlist             | 🔒 `DELETE /api/playlists/:id`                  | nothing                        | confirmation              |

## Comments

| What you want to do            | Ask for                                    | Send                          | You get back      |
|-----------------------------------|------------------------------------------------|------------------------------------|-----------------------|
| See comments on a song            | `GET /api/comments/song/:songId`              | nothing                            | list of comments      |
| See comments on a playlist        | `GET /api/comments/playlist/:playlistId`      | nothing                            | list of comments      |
| Post a comment                   | 🔒 `POST /api/comments`                        | text, and songId OR playlistId     | the new comment       |
| Delete my own comment            | 🔒 `DELETE /api/comments/:id`                  | nothing                            | confirmation          |

That's the whole menu. Every "dish" above is one function inside the
`controllers/` folder, wired to a URL in the `routes/` folder.
