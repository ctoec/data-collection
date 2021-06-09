# Manipulating Data
Application data that is not user-generated must be created (or potentially updated), and thankfully we have a couple scripts to do just that.

## Prerequisites
Local DB connections need to be established (via ssh tunnels or whatever you want) before running.

## Creating new user data
From csv data with formats defined [here](https://docs.google.com/spreadsheets/d/1H7Q5sPkcGqgdZdqzJpH2f-PluQgEfLZ6Dxy4xmIQTZ4/edit#gid=664790308), the script optionally creates
- Organizations and their funding spaces
- Sites
- Users and their permissions
- Reporting periods

### Usage
```
$ yarn ts-node src/data/prod/create.ts --config [CONFIG_FILE_PATH]
```
where:
- `CONFIG_FILE_PATH` is an absolute path to the config file

example:
```
$ cp src/data/prod/config.example.json ./config.json
$ vim config.json // edit config to contain real values!
$ yarn ts-node src/data/prod/create.ts --config `pwd`/config.json
```

Alternatively, script can generate and send invite emails (through the winged-keys app) to users so they can set passwords and use the tool!

## Updating existing user emails
There are times where we may need to update a user's email within WingedKeys, and will need to propagate that update over to Fawkes.  The `updateEmail` script handles just that, porting the state of all users in WingedKeys and applying that state to all corresponding users in Fawkes.

### Usage
```
$ yarn ts-node src/data/prod/updateEmail.ts --config [CONFIG_FILE_PATH]
```
where:
- `CONFIG_FILE_PATH` is an absolute path to the config file

example:
```
$ cp src/data/prod/config.example.json ./config.json
$ vim config.json // edit config to contain real values!
$ yarn ts-node src/data/prod/users/updateEmail.ts --config `pwd`/config.json
```

## Configuration
Configuration is supplied as a JSON file like:
```
{
  "app": {
    "db": {
      "user": "",
      "password": "",
      "server": "",
      "port": 0
    }
  },

  "wingedKeys": {
    "db": {
      "user": "",
      "password": "",
      "server": "",
      "port": 0
    },
    "site": {
      "url": "",
      "user": "",
      "password": ""
    }
  },

  "orgFile": "",
  "siteFile": "",
  "userFile": "",
  "reportingPeriodFile": ""
}
```
**NOTE**: If `userFile` config value is suppled, then all `wingedkeys` configs (both site and db) must also be supplied.
**NOTE**: instead of passing app db overrides, you can just update your local ormconfig but DON'T FORGET TO CHANGE IT BACK.
**NOTE**: At least one file param must be supplied.

## Docker
If you're running this is in docker (for instance, on a node image), you'll need to install a few dependencies to get puppeteer working.
Run the `apt-get` command they've got in their puppeteer-in-docker [example Dockerfile](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker)

## Gotchas
- Any changes to the template columns (not titles, just order) will require changes to the corresponding row class defined in the various data creation utils
- Org/site names cannot have commas (",") in them because this will mess with parsing. So just take them out, sorry.
