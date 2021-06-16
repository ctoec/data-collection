# Manipulating Data
Application data that is not user-generated must be created (or potentially updated), and thankfully we have a couple scripts to do just that.

## Prerequisites
In order to execute any of the scripts outlined below on any remote environments, you'll need to be able to open database connections on the necessary remote instances directly from your local machine.  This can most easily be handled with [local SSH port forwarding](https://www.ssh.com/academy/ssh/tunneling/example#local-forwarding) through the jump server of the environment you'd like to operate against.

As an example, the following command will create an SSH tunnel to the staging ECE Reporter DB through the staging jump server, forwarding all local traffic on port 1433 (the default for SQL Server) to port 1433 on the DB instance:

```
ssh -L 1433:staging.ece-fawkes-db.ctoecskylight.com:1433 <ssh-user>@staging.ece-jumpserver.ctoecskylight.com
```

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

Example:
```
$ cp src/data/prod/config.example.json ./config.json
$ vim config.json // edit config to contain real values!
$ yarn ts-node src/data/prod/create.ts --config `pwd`/config.json
```

Alternatively, script can generate and send invite emails (through the winged-keys app) to users so they can set passwords and use the tool!

## Update User Emails
There are times where we may need to update a user's email within WingedKeys, and will need to propagate that update over to Fawkes.  The `updateEmail` script handles just that, porting the state of all users in WingedKeys and applying that state to all corresponding users in Fawkes.

### Usage
1. Create an application/database configuration file named `config.json` and update accordingly, based on the template at `config.example.json`.  You'll need both `app` and `wingedKeys` db configurations.
   ```
   $ cp src/data/prod/config.example.json ./config.json
   $ vim config.json // edit config to contain real values!
   ```
1. Set up local port forwarding to both the WingedKeys and Fawkes DB instances, respectively.
   ```
   $ ssh -L -fN <app-config-port>:<stage>.ece-fawkes-db.ctoecskylight.com:1433 <ssh-user>@<stage>.ece-jumpserver.ctoecskylight.com
   $ ssh -L -fN <wingedkeys-config-port>:<stage>.ece-wingedkeys-db.ctoecskylight.com:1433 <ssh-user>@<stage>.ece-jumpserver.ctoecskylight.com
   ```
1. Run the script!
   ```
   $ yarn ts-node src/data/prod/updateEmail.ts --config <absolute-path-to-repo>/src/data/prod/config.json
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
