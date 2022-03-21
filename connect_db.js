const sqlite3 = require('sqlite3').verbose();

// open database
let db = new sqlite3.Database('./SQL/chinook.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('\n** Connected to the Chinook SQlite database. **\n');
});

let sql = `SELECT PlaylistId id,
                  Name name
           FROM playlists
           WHERE PlaylistId  = ?`;

let playlistId = 16;


db.get(sql, [playlistId], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  return row
    ? console.log(row.id, row.name)
    : console.log(`No playlist found with the id ${playlistId}`);
});

let sql_tracks = `SELECT Name name, AlbumId album, Composer composer, GenreId genre
            FROM tracks
            WHERE GenreId = ?
            ORDER BY AlbumId`;

let sql_tracks_albums = `SELECT tracks.Name AS track, albums.Title AS album,
                        artists.Name AS artist
                        FROM tracks 
                        JOIN albums 
                        ON tracks.AlbumId=albums.AlbumId
                        JOIN artists
                        ON artists.ArtistID=albums.ArtistId
                        WHERE tracks.GenreId = ?`;

console.log('\n** Alternative and Punk tracks **')

db.each(sql_tracks_albums, ['4'], (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.track} - ${row.album} by ${row.artist}`);
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('\n** Closed the database connection. **\n');
});