# .CSV filter program for Availity

This program can read the content of the CSV file and separate enrollees by insurance company in its own file.

Additionally, it will sort the contents of each file by last and first name (ascending).

Also, if there are duplicate User Ids for the same Insurance Company, then only the record with the highest version should be included. The following data points are included in the file:

- First Name
- Last Name
- Insurance
- Version.

Data points names are adjustable and could be easily changed by a developer (_lines 11-15_ of **index.js**).

There is a test csv file in the directory for demo purposes (**file.csv**).
