#!/usr/bin/env node
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as inquirer from 'inquirer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as chalk from 'chalk';

/**
 * Project Creation CLI tool for starting new node.js projects from alexa-smart-screen-web-components
 */

const PRINT_PADDING_LENGTH = 8;
const CONFIG_FILE = '.config.json';
const ALEXA_SMART_SCREEN_PREFIX = 'alexa-smart-screen-';
const IGNORE_FILES = ['dist', 'node_modules', CONFIG_FILE];
const WORKING_DIR = process.cwd();
const PROJECT_TEMPLATES = fs.readdirSync(path.join(WORKING_DIR, 'templates'));
const SAMPLE_APP_COPY_TEMPLATE_NAME = 'alexa-smart-screen-sample-app-copy';
const DEFAULT_TEMPLATE = PROJECT_TEMPLATES.includes(SAMPLE_APP_COPY_TEMPLATE_NAME) ? SAMPLE_APP_COPY_TEMPLATE_NAME : PROJECT_TEMPLATES[0];
const NEW_PROJECT_ROOT_DIR = path.join(WORKING_DIR, '../');
const QUESTIONS = [
  {
    name : 'template',
    type : 'list',
    message : 'What project template would you like to use:',
    default : DEFAULT_TEMPLATE,
    choices : PROJECT_TEMPLATES
  },
  {
    name : 'name',
    type : 'input',
    message : 'Project name:',
    validate : (input : string) => {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores(_) and hyphens(-).';
    }
  }
];

let projectName = '';

/**
 * Interface for project template component requirements
 * @member packages - (Optional) list of (prefix-less) named components from /packages workspace.
 * @member samples - (Optional) list of (prefix-less) named components from /samples workspace.
 */
export interface IProjectTemplateComponents {
  packages ?: string[],
  samples ?: string[]
}

/**
 * Interface for additional files required by the template project
 * @member rootDir - root directory in alexa-smart-screen-web-components for the additional files.
 * @member files - list of file names to copy from the specified root directory.
 */
export interface IProjectTemplateAdditionalFiles {
  rootDir : string,
  files : string[]
}

/**
 * Interface for configurations for the template project
 * @member components - (Optional) IProjectTemplateComponents required by the template project.
 * @member additionalFiles - (Optional) IProjectTemplateAdditionalFiles required by the template project.
 */
export interface IProjectTemplateConfig {
  components ?: IProjectTemplateComponents,
  additionalFiles ?: IProjectTemplateAdditionalFiles[]
}

prettyPrint(chalk.blue, [
  'Welcome to the Alexa Smart Screen Web Components Project Creator!',
  'Use the following command-line prompts to start a new project.'
]);

/**
 * Inquirer CLI prompt and project creation from answers.
 */
inquirer.prompt(QUESTIONS)
  .then(answers => {
    projectName = answers['name'];
    const projectChoice = answers['template'];
    const templatePath = path.join(WORKING_DIR, 'templates', projectChoice);
    const newProjectDir = path.join(NEW_PROJECT_ROOT_DIR, projectName);
    const projectConfig = getProjectConfig(templatePath);
    if (!projectConfig) return;

    // Attempt to create new project directory
    if (!createProjectDirectory(newProjectDir)) {
      projectCreationFailed();
      return;
    }

    // Copy over the template project
    if (!copyTemplateDirectory(templatePath, newProjectDir)) {
      projectCreationFailed(newProjectDir);
      return;
    }
    // Copy any additional files from the monorepo required by the template project
    if (projectConfig.additionalFiles) {
      for (const additionalFileCollection of projectConfig.additionalFiles) {
        for (const additionalFile of additionalFileCollection.files) {
          const filePath = path.join(WORKING_DIR, path.join(additionalFileCollection.rootDir, additionalFile));
          if (!copyTemplateFile(additionalFile, filePath, newProjectDir)) {
            projectCreationFailed(newProjectDir);
            return;
          }
        }
      }
    }

    // Attempt to configure the project and install dependencies
    if (!configureProject(newProjectDir, projectConfig)) {
      projectCreationFailed();
      return;
    }

    prettyPrint(chalk.green, [
      'Project creation complete!',
      `Navigate to project at: cd ${newProjectDir}`
    ]);
  });

/**
 * Handle project creation failure
 * @param deleteNewProjectDirPath - new project directory path.  include it if the project should be deleted.
 */
function projectCreationFailed(deleteNewProjectDirPath : string = undefined) {
  if (deleteNewProjectDirPath && fs.existsSync(deleteNewProjectDirPath)) {
    fs.rmSync(deleteNewProjectDirPath, { recursive : true });
  }
  prettyPrint(chalk.red, [
    'Project creation failed!',
    `Please refer to any errors above.`
  ]);
}

/**
 *  When using pretty print, we pad our strings in the beginning and in the end with the margin representation '#'
 *  and 8 spaces. E.g., if I pass "Hello world!" string, pretty print will look like:
 *  ############################
 *  #       Hello world!       #
 *  ############################
 * @param chalkColor - the chalk color used for the console logs
 * @param lines - array of strings to pretty print as individual lines
 */
function prettyPrint(chalkColor : chalk.Chalk, lines : string[]) {
  console.log('');
  let maxLength  = 0;
  for (const line of lines) {
      maxLength = Math.max(line.length, maxLength);
  }

  let boxLine  = '';
  boxLine = boxLine.padStart(maxLength + (2 * PRINT_PADDING_LENGTH), '#');
  console.log(chalkColor(boxLine));

  for (const line of lines) {
    const linePadding = ((maxLength - line.length) / 2) + PRINT_PADDING_LENGTH;
    let consoleLine  = '#';
    consoleLine = consoleLine.padEnd(linePadding, ' ');
    consoleLine += line;
    consoleLine = consoleLine.padEnd((linePadding * 2) + (line.length - 1) , ' ');
    consoleLine += '#';
    console.log(chalkColor(consoleLine));
  }
  console.log(chalkColor(boxLine));
  console.log('');
}  

/**
 * Returns the serialized IProjectTemplateConfig from the template project's .config.json file
 * @param projectPath - path for the template project
 * @returns IProjectTemplateConfig
 */
function getProjectConfig(projectPath : string) : IProjectTemplateConfig | undefined {
  const projectConfigPath = path.join(projectPath, CONFIG_FILE);
  if (!fs.existsSync(projectConfigPath)) {
    prettyPrint(chalk.red, [
      `Project config is missing!`,
      `No config at: ${projectConfigPath}.`
    ]);
    return undefined;
  }
  const configContent = fs.readFileSync(projectConfigPath);

  return JSON.parse(configContent.toString()) as IProjectTemplateConfig;
}

/**
 * Creates project directory at path if it does not exist, errors if it does.
 * @param projectPath - path for the template project
 * @returns true if directory created
 */
function createProjectDirectory(projectPath : string) : boolean {
  if (fs.existsSync(projectPath)) {
    prettyPrint(chalk.red, [
      `Project directory ${projectPath} already exists!`,
      `Delete existing project or use a different name.`
    ]);
    return false;
  }

  fs.mkdirSync(projectPath);
  return true;
}

/**
 * Builds a command-line string to run for installing yarn component dependencies
 * @param workspace - component workspace
 * @param components - list of (prefix-less) components to add as dependencies
 * @returns yarn command string
 */
function buildYarnAddComponentsCmd(workspace : string, components : string[]) : string {
  let cmd = '';
  if (!components) return cmd;
  const componentsPath = path.join(WORKING_DIR, workspace);
  for(const component of components) {
    const componentPath = path.join(componentsPath, ALEXA_SMART_SCREEN_PREFIX + component);
    cmd += `yarn add file ${componentPath} -D && `
  }
  return cmd;
}

/**
 * Configure the dependencies of the template project
 * @param projectPath - path to the template project
 * @param config - IProjectTemplateConfig
 * @returns true if the dependency configuration succeeds.
 */
function configureProject(projectPath : string, config : IProjectTemplateConfig) : boolean {
  prettyPrint(chalk.yellow, ['Configuring Project']);
  shell.cd(projectPath);

  let cmd = 'yarn install && ';

  cmd += buildYarnAddComponentsCmd('packages', config.components.packages);  
  cmd += buildYarnAddComponentsCmd('samples', config.components.samples); 

  cmd += 'yarn build';

  const result = shell.exec(cmd);

  if (result.code !== 0) {
    prettyPrint(chalk.red, ['yarn installation failed!', `Open project to investigate: ${projectPath}`]);
    return false;
  }
  return true;
}

/**
 * Copies a file from the template project
 * @param file - file name with extension
 * @param filePath - file path in the template project
 * @param copyDirPath - directory path in the new project used for file copying
 */
function copyTemplateFile(file : string, filePath : string, copyDirPath : string) : boolean {
  if (!fs.existsSync(filePath)) {
    prettyPrint(chalk.red, [
      `Template file is missing!`,
      `${filePath}`
    ]);
    return false;
  }
  // get stats about the current file
  const stats = fs.statSync(filePath);
  const writePath = path.join(copyDirPath, file);
  if (stats.isFile()) {
    try {
      if (file === 'package.json') {
        // Set projectName in package.json
        let contents = fs.readFileSync(filePath, 'utf8');
        contents = ejs.render(contents, {projectName});
        fs.writeFileSync(writePath, contents, 'utf8');
      } else {
        fs.copyFileSync(filePath, writePath);
      }
      return true;
    } catch {
      prettyPrint(chalk.red, [
        `Template file copy failed!`,
        `src: ${filePath}`,
        `dest: ${writePath}`
      ]);
      return false;
    }
  } else if (stats.isDirectory()) {
    copyDirPath = path.join(copyDirPath, path.basename(filePath));
    fs.mkdirSync(copyDirPath);
    return copyTemplateDirectory(filePath, copyDirPath);
  }
  return false;
}

/**
 * Copies all non-ignored files from the template project directory to the new project
 * @param dirPath - template project directory path
 * @param copyDirPath - directory path in the new project used for file copying 
 */
function copyTemplateDirectory(dirPath : string, copyDirPath : string) : boolean {
  let directoryCopied = false;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (IGNORE_FILES.indexOf(file) > -1) continue;
    const filePath = path.join(dirPath, file);
    directoryCopied = copyTemplateFile(file, filePath, copyDirPath);
    if (!directoryCopied) {
      break;
    }
  }
  return directoryCopied;
}