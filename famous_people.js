const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

// var name = process.argv[2];

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  const query = `SELECT *
                  FROM famous_people
                  WHERE first_name ILIKE $1::text
                  OR last_name ILIKE $1::text;`;
  client.query(query, [`%${process.argv[2]}%`],(err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log("Searching ...");
    console.log(`Found ${result.rows.length} person(s) by the name '${process.argv[2]}'`);

    let i = 1;
    result.rows.forEach ( x => {
      console.log(`- ${i} ${x.first_name} ${x.last_name}, born '${x.birthdate.toLocaleString().slice(0,-9)}'`);
      i ++
    });

    client.end();
  });
});