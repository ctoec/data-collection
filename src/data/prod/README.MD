# Creating data
Application data that is not user-generated must be created, and `src/data/prod/create.ts` is a script to do that.
From csv data with formats defined [here](https://docs.google.com/spreadsheets/d/1H7Q5sPkcGqgdZdqzJpH2f-PluQgEfLZ6Dxy4xmIQTZ4/edit#gid=664790308), the script optionally creates
- Organizations and their funding spaces
- Sites
- Users and their permissions
- Reporting periods

## Usage
```
$ yarn ts-node src/data/prod/create.ts [OPTIONS]
```
where options are:
- dbuser (optional): db username to override local ormconfig value
- dbpassword (optional): db password to override local ormconfig value
- dbhost (optional): db host to override local ormconfig value
- dbport (optional): db port to override local ormconfig value
- orgfile (optional): path to file containing organization data
- sitefile (optional): path to file containing site data
- userfile (optional): path to file containing user data

  NOTE: Users must first be created in IdentityServer instance, and UUIDs queried and added to application user data
- reportingperiodfile (optional: path to file containing reporting period data

**NOTE**: instead of passing db overrides, you can just update your local ormconfig but DON'T FORGET TO CHANGE IT BACK.
**NOTE**: At least one file param must be supplied.
