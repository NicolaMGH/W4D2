const settings = require("./settings");
const knex = require('knex')({
  client: 'pg',
  connection: {
    host     : settings.hostname,
    user     : settings.user,
    password : settings.password,
    database : settings.database
  }
});

knex.select()
  .table(`famous_people`)
  .where(`first_name`, `ILIKE` , `%${process.argv[2]}%`)
  .orWhere(`last_name`, `ILIKE` , `%${process.argv[2]}%`)
    .then(function(result) {
      console.log("Searching ...");
      console.log(`Found ${result.length} person(s) by the name '${process.argv[2]}'`);

      let i = 1;
      result.forEach ( x => {
        const line = `- ${i} ${x.first_name} ${x.last_name}, born '${x.birthdate.toLocaleString().slice(0,-9)}'`;
        console.log(line);
        i ++
      });

      knex.destroy();
})
    .catch(function(error) {
      console.error(error)
});