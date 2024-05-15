'use strict';
const { exec } = require('child_process');
const workflowScriptPath = '/home/pi/topten/orchestration/workflow_manager.py';  // Adjust this path if necessary
const toptenPath = '/home/pi/topten'; // Path to the topten project

function runworkflow(player, values) {
  return new Promise((resolve, reject) => {
    const command = `PYTHONPATH=${toptenPath} python3 ${workflowScriptPath}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject({ error: stderr });
      } else {
        resolve({ output: stdout });
      }
    });
  });
}

module.exports = function (api) {
  api.registerAction('runworkflow', runworkflow);
};