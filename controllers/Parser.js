"use strict";

const csv = require("csv-parser");
const fs = require("fs");

class Parser {
  constructor() {
    this.initialData = "affairmapping.csv";
    this.outputFile = "result.txt";
  }
  parseFile() {
    const responseArr = [];

    fs.createReadStream(this.initialData)
      .pipe(csv())
      .on('data', data => {
        const bulletKeys = this._getBulletKeys(data);
        const response = {
          sexual_orientation: this._getSexualOrientation(data),
          gender: this._getGender(data),
          race: this._getRace(data),
          build: this._getBuild(data),
          age: this._getAge(data),
          marital_status: this._getMaritalStatus(data),
          bulletKeys: [...new Set(bulletKeys)]
        };

        for (let key in response) {
          if (!response[key] || response[key].length === 0) {
            delete response[key];
          }
        }

        responseArr.push(response);
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", () => {
        fs.writeFile(this.outputFile, JSON.stringify(responseArr, null, 2), "utf-8", (err) => {
          if (err) {
            console.log(err);
          }

          console.log(`Data was successfully saved to the ${this.outputFile}`);
          return true;
        })
      })
  }

  _getSexualOrientation(data) {
    let sexRaw = data.sexual_orientation.split(/[:,]+/)[1];

    if (sexRaw) {
      return JSON.parse(sexRaw);
    }

    return null;
  }

  _getGender(data) {
    const genderRaw = data.gender.split(/[:,']+/)[1];

    if (genderRaw) {
      return genderRaw.replace(/"/g, '');
    }

    return null;
  }

  _getRace(data) {
    return JSON.parse("[" + data.race.slice(8, 9) + "]") || null;
  }

  _getAge(data) {
    const rawAge = data.age;

    if (rawAge === "-") {
      return null;
    }

    const age = {};

    age.from = rawAge.slice(14, 16) || null;
    age.to = rawAge.slice(22, 24) || null;

    if (!age.from) {
      return null;
    }

    return age;
  }

  _getBuild(data) {
    return JSON.parse("[" + data.build.slice(9, data.build.length-1) + "]") || null;
  }

  _getMaritalStatus(data) {
    return JSON.parse("[" + data.build.slice(9, data.build.length-1) + "]") || null;
  }

  _getBulletKeys(data) {
    const bulletKeys = [];

    if (data.niche1.length > 1) {
      bulletKeys.push(data.niche1.toLowerCase());
    }

    if (data.niche2.length > 1) {
      bulletKeys.push(data.niche2.toLowerCase());
    }

    if (data.niche3.length > 1) {
      bulletKeys.push(data.niche3.toLowerCase());
    }

    if (data.niche4.length > 1) {
      bulletKeys.push(data.niche4.toLowerCase());
    }

    if (data.niche5.length > 1) {
      bulletKeys.push(data.niche5.toLowerCase());
    }

    return bulletKeys;
  }

}

module.exports = Parser;