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

import * as sinon from "sinon";
import * as chai from "chai";
import { createMock } from 'ts-auto-mock';

import {
  ILoggerFactory,
  IVersionManager,
  INamespaceVersionEntry } from "@alexa-smart-screen/common";

import { VersionManager } from "../../src/versionManager/VersionManager";

describe("@alexa-smart-screen/app-utils - VersionManager functionality", () => {
  let loggerFactory : ILoggerFactory;
  let versionManager : IVersionManager;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  const nsVersionEntryA : INamespaceVersionEntry = {namespace : "A", version : 1};
  const nsVersionEntryB : INamespaceVersionEntry = {namespace : "B", version : 2};
  const nsVersionEntryC : INamespaceVersionEntry = {namespace : "C", version : 3};

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    versionManager = new VersionManager(loggerFactory);
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it(`should add a namespace-version entry to the VersionManager`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()[0]).to.deep.equal(nsVersionEntryA);
  });

  it(`should overwrite a duplicate namespace-version entry with the same namespace added to the VersionManager`, () => {
    const nsVersionEntryOverwritten : INamespaceVersionEntry = {namespace : "A", version : 5};

    chai.expect(versionManager.getNamespaceVersionEntries()).to.have.lengthOf(0);
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.equal([nsVersionEntryA]);
    
    chai.expect(versionManager.getNamespaceVersionEntries()).to.have.lengthOf(1);

    versionManager.addNamespaceVersionEntry(5, nsVersionEntryA.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()).to.have.lengthOf(1); // Should not add a new entry to the VersionManager

    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.equal([nsVersionEntryOverwritten]);
  });

  it(`should add multiple namespace-version entries to the VersionManager`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryB.version, nsVersionEntryB.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryC.version, nsVersionEntryC.namespace);
    
    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.equal([nsVersionEntryA, nsVersionEntryB, nsVersionEntryC])
  });

  it(`should remove a namespace-version entry from the VersionManager`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryB.version, nsVersionEntryB.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryC.version, nsVersionEntryC.namespace);
    
    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.include(nsVersionEntryB);
    versionManager.removeNamespaceVersionEntry(nsVersionEntryB.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()).to.not.include(nsVersionEntryB);
  });

  it(`should remove multiple namespace-version entries from the VersionManager`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryB.version, nsVersionEntryB.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryC.version, nsVersionEntryC.namespace);
    
    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.include(nsVersionEntryB);
    versionManager.removeNamespaceVersionEntry(nsVersionEntryB.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()).to.not.include(nsVersionEntryB);

    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.include(nsVersionEntryA);
    versionManager.removeNamespaceVersionEntry(nsVersionEntryA.namespace);
    chai.expect(versionManager.getNamespaceVersionEntries()).to.not.include(nsVersionEntryA);
  });

  it(`should validate whether a namespace-version entry exists in the VersionManager`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryC.version, nsVersionEntryC.namespace);
    
    chai.expect(versionManager.validateNamespaceVersion(nsVersionEntryA.namespace, nsVersionEntryA.version)).to.be.true;
    chai.expect(versionManager.validateNamespaceVersion(nsVersionEntryB.namespace, nsVersionEntryB.version)).to.be.false;
  });

  it(`should fail validation if namespace exists with a different version`, () => {
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);    
    chai.expect(versionManager.validateNamespaceVersion(nsVersionEntryA.namespace, 10)).to.be.false;
  });

  it(`should get all namespace-version entries added to the VersionManager`, () => {
    chai.expect(versionManager.getNamespaceVersionEntries()).to.have.lengthOf(0);
    versionManager.addNamespaceVersionEntry(nsVersionEntryA.version, nsVersionEntryA.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryB.version, nsVersionEntryB.namespace);
    versionManager.addNamespaceVersionEntry(nsVersionEntryC.version, nsVersionEntryC.namespace);

    chai.expect(versionManager.getNamespaceVersionEntries()).to.deep.equal([nsVersionEntryA, nsVersionEntryB, nsVersionEntryC])
  });

});
