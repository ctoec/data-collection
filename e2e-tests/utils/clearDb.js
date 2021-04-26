const { exec } = require('child_process');

module.exports =  {
  clearDb: async function () {
    exec("docker-compose stop db", function(err, stdout, stderr)  {
      console.log(stdout);
    });
    exec("docker-compose rm -f db", function(err, stdout, stderr)  {
      console.log(stdout);
    });
    exec("docker-compose start db", function(err, stdout, stderr)  {
      console.log(stdout);
    });
  }
}