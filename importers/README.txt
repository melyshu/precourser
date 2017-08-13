IMPORTER README
A guide to importing data into the database

Set up as follows:

1.  Ensure that the .env file (in the root directory) has a line
      MONGODB_URI=<insert your mongoDB URI>
    in it.

2.  Ensure that importers/helpers/hardcode/SEMESTERS.js is up to date with the
    latest information. Check the registrar's academic calendar for semester
    start and end dates.

3.  (optional) Ensure that importers/helpers/hardcode/DEPARTMENTS.js is up to
    date with the latest information. It probably won't change that much unless
    a new department is added, which isn't the easiest thing to find out about,
    so skip this for now if necessary, it's not too important. Refer to step 8.

4.  Ensure that the following global variables in importers/importer.js are
    up to date:
      CURRENT_SEMESTER
      LAST_SEMESTER_WITH_EVALUATIONS
      SEMESTERS

5.  (optional) Configure the log settings in importers/log/logger.js

6.  Read all the comments in importers/importer.js. They contain a lot of useful
    information!

7.  Now that you know what the functions do, use them! The scripts
      importers/build.js
      importers/update.js
    have been provided for convenience. Use importers/build.js to build (or
    update) the database from the ground up, and importers/update.js to update
    just the most relevant (recent) data in the database.

    e.g.
      $ node <path to importers/build.js>

8.  Once your database is up you can find which departments need to be manually
    inserted into /helpers/hardcode/DEPARTMENTS.js by running
    importers/detectNewDepartments.js.

    e.g.
      $ node <path to importers/detectNewDepartments.js>

    Once the department data has been filled in, run importers/update.js to
    update the database.

    e.g.
      $ node <path to importers/update.js>
