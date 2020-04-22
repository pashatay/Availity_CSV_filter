const fs = require("fs");

const data = fs
  .readFileSync("file.csv") //or any other directory
  .toString() // convert Buffer to string
  .split("\n") // split string to lines
  .map((e) => e.trim()) // remove white spaces for each line
  .map((e) => e.split(",").map((e) => e.trim())); // split each line to array

const nameTabs = data[0];
const userIdInx = nameTabs.indexOf("User ID");
const firstNameInx = nameTabs.indexOf("First Name");
const lastNameInx = nameTabs.indexOf("Last Name");
const carrierInx = nameTabs.indexOf("Insurance");
const version = nameTabs.indexOf("Version");

//function to group data in a hash table by any parametr
function filterData(data, idx) {
  let obj = {};
  for (let arr of data) {
    let sortingParam = arr[idx];
    obj[sortingParam]
      ? (obj[sortingParam] = [...obj[sortingParam], arr])
      : (obj[sortingParam] = [arr]);
  }
  return obj;
}

//sorting function for hash tables
function sort(obj, idx) {
  let sortedData = [];
  for (let key in obj) {
    let sortedArray = obj[key];
    sortedData.push(
      sortedArray.sort((a, b) => {
        return b[idx] - a[idx];
      })
    );
  }
  return sortedData;
}

function sortNames(array, idx, idx2) {
  return array.sort(function (a, b) {
    if (a[idx] === b[idx]) {
      if (a[idx2] < b[idx2]) return -1;
      if (a[idx2] > b[idx2]) return 1;
      return 0;
    } else {
      if (a[idx] < b[idx]) return -1;
      if (a[idx] > b[idx]) return 1;
      return 0;
    }
  });
}

function writeSeparateFile(data) {
  //iterating through the hash table where data is grouped by the carrier
  for (let carrier in data) {
    //grabbing an array of users from the carrier
    let arrOfDataPerCarrier = data[carrier];
    //grabbing the name of the carrier to name the file
    let fileName = arrOfDataPerCarrier[0][carrierInx];
    //if there is only 1 person assigned to the carrier we can go ahead
    //and create the file
    if (arrOfDataPerCarrier.length === 1) {
      let writeToFile = ["\n", nameTabs, "\n", arrOfDataPerCarrier[0]];
      fs.writeFile(`${fileName}.csv`, writeToFile, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
    //if there is more than 1 person, we need to exclude duplicates
    //except the one with the highest version
    else {
      let noDuplicateIdArr = [];
      let writeToFile = ["\n", nameTabs];
      //filtering all the users and grouping them
      //by the id# in a hash table
      let filteredByUserIdObj = filterData(arrOfDataPerCarrier, userIdInx);
      //iterating over the hash table and sorting each group of users
      //by version#, putting the highest version user in the front of the array
      let sortedArrOfDataPerUserId = sort(filteredByUserIdObj, version);
      //iterating over an array of arrays of users and pushing
      //the first user-with the highest version # to a new array
      for (let sameUsers of sortedArrOfDataPerUserId) {
        noDuplicateIdArr.push(sameUsers[0]);
      }
      //sorting users by first and last name
      let sortedByNameArr = sortNames(
        noDuplicateIdArr,
        lastNameInx,
        firstNameInx
      );
      //preparing users to be written to file
      for (let user of sortedByNameArr) {
        writeToFile.push("\n", user);
      }
      //writing the file with all the unique and sorted users
      fs.writeFile(`${fileName}.csv`, writeToFile, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
  }
}

//grouping data by carries name in a hash table
let filteredByCarriersObj = filterData(data.slice(1), carrierInx);
//calling function to write separate files for each carrier
writeSeparateFile(filteredByCarriersObj);

//console.log(JSON.stringify(data, "", 2));
