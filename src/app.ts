import { readdir, readFile, writeFileSync } from "fs";
import { extname } from "path";
import { ILogsData, ILogData } from "./models/ILogsData";
import { IResponse, IData } from "./models/IResponse";
import * as CONSTANT from "./constants/constant"

const dirPath: string = '../LogsReader/logs/';

// Get directory files
readdir(dirPath, (err: any, fileNames: any[]) => {
  if (err) {
    console.log(CONSTANT.dirNotFound, err);
    return;
  }
  // Loop fileNames array
  if (fileNames && fileNames.length > 0) {

    const resultData: IResponse[] = [];
    let file_counter: number = 1;

    for (const filename of fileNames) {
      // Get only .json files
      if (extname(filename) == ".json") {
        // Reading file content
        readFile(dirPath + filename, "utf-8", (err: any, content:any) => {
          if (err) {
            console.log(CONSTANT.readFileError, err);

            return;
          }
          try {
            // Covert file content to json format
            const data: ILogsData = JSON.parse(content);
            // ProduceData of duplicate emails in logs
            const result: IResponse = produceData(data, filename)
            

            // Pushing produce data to an array
            resultData.push(result);
            file_counter++;
            // Execute after reading all files content
            if (file_counter == fileNames.length) {
              console.log(filename, JSON.stringify(resultData));

              // Optional function just to verify output in separate file
              writeFile(resultData);
            }
          } catch (err) {
            console.error(`${CONSTANT.errorParsingFile} ${filename}`, err);

            return;
          }
        });
      }
    }
  } else {
    console.info(`${CONSTANT.noJsonFile}  ${dirPath}`);
  }

});

function produceData(data: any, filename:string) {
  const produce: IData[] = [];
  const temp: IData[] = [];

  // Counting number of duplicate emails in logs
  for (let i in data.logs) {
    // Reach each record in logs
    if (temp.indexOf(data.logs[i].email) == -1) {
      let _data: IData;

      temp.push(data.logs[i].email);
      _data = {
        email: data.logs[i].email,
        total: 1
      }
      produce.push(_data);
    } else {
      // Checking for duplicate email in logs, if found increasing total count
      for (let j in produce) {
        if (produce[j].email === data.logs[i].email) {
          let _x = produce[j].total + 1;
          produce[j].total = _x;
        }
      }
    }
  }
  const proData: IResponse = {
    filename: filename,
    losg_id: data.id,
    tally: produce
  } 

  return proData;
}
// Optional function jsut to verify output
function writeFile(resultData: IResponse[]) {
  const jsonString = JSON.stringify(resultData);

  try {
    writeFileSync("./output/console_data.json", jsonString);
    console.log("------------", CONSTANT.fileSuccess, ": ./output/console_data.json------------");
  } catch (err) {
    if (err) {
      console.log(CONSTANT.creatFileError, err);

      return;
    }
  }

}

