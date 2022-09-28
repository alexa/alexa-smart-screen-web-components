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

import { Router } from '../src/Router';
import { DirectiveHandler, IDirective, IIPCNamespaceConfig, ILogger, ILoggerFactory, IVersionManager } from '@alexa-smart-screen/common';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';

class HandlerA extends DirectiveHandler {
  getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return {namespace : "namespaceA", version : 1} as IIPCNamespaceConfig;
  }
  public method1() { 
    // do nothing
  }
}

class HandlerB extends DirectiveHandler {
  getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return {namespace : "namespaceB", version : 1} as IIPCNamespaceConfig;
  }
  public method1() { 
    // do nothing
  }
  public method2() { 
    // do nothing
  }
}

describe('@alexa-smart-screen/router', () => {
  let router : Router;
  let logger : ILogger;
  let versionManager : IVersionManager;
  const sandbox = sinon.createSandbox();
  let method1HandlerA : sinon.SinonSpy;
  let method1HandlerB : sinon.SinonSpy;
  let method2HandlerB : sinon.SinonSpy;

  //stubs
  let versionManagerAddNamespaceVersionEntryStub : sinon.SinonStub;
  let versionManagerRemoveNamespaceVersionEntryStub : sinon.SinonStub;

  const validDirective : IDirective = {
    header : {
      version : 1,
      namespace : 'namespaceA',
      name : 'method1',
      clientId : 'xyz'
    },
    payload : {}
  };

  const invalidDirective : IDirective = {
    header : {
      version : 1,
      namespace : 'namespaceC',
      name : 'method1',
      clientId : 'xyz'
    },
    payload : {}
  }

  const registry1 = { version : 1, namespace : 'namespaceA', handler : HandlerA };
  const registries1 = [
    { version : 1, namespace : 'namespaceA', handler : HandlerA },
    { version : 1, namespace : 'namespaceB', handler : HandlerB }
  ]

  const registries2 = [
    { version : 1, namespace : 'namespaceA', handler : HandlerA },
    { version : 2, namespace : 'namespaceA', handler : HandlerA }
  ]

  beforeEach(() => {
    const loggerFactory = createMock<ILoggerFactory>();
    logger = createMock<ILogger>();
    versionManager = createMock<IVersionManager>();
    router = new Router(loggerFactory, versionManager);
    method1HandlerA = sandbox.spy(HandlerA.prototype, 'method1');
    method1HandlerB = sandbox.spy(HandlerB.prototype, 'method1');
    method2HandlerB = sandbox.spy(HandlerB.prototype, 'method2');

    versionManager.addNamespaceVersionEntry = sandbox.stub();
    versionManagerAddNamespaceVersionEntryStub = versionManager.addNamespaceVersionEntry as sinon.SinonStub;
   
    versionManager.removeNamespaceVersionEntry = sandbox.stub();
    versionManagerRemoveNamespaceVersionEntryStub = versionManager.removeNamespaceVersionEntry as sinon.SinonStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('registration functionality', () => {
    registries1.forEach((x) => {
      it(`should be able to register ${x.handler.name} to the router.`, () => {
        expect(() => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        }).not.to.throw();
        assert.strictEqual(router.handler.size, 1);
      });
    });

    it('should be able to register all the classes to the router.', () => {
      expect(() => {
        registries1.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        });
      }).not.to.throw();
      assert.strictEqual(router.handler.size, registries1.length);
    });

    it('should overwrite a duplicate entry with same namespace but different version', () => {
      expect(() => {
        registries2.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        });
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 1);
    });
  });

  describe('routing functionality', () => {
    it('should be able to route message with single registry.', () => {
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
        router.handleDirective(validDirective);
      }).not.to.throw();
      sinon.assert.calledOnceWithExactly(method1HandlerA, {});
      sinon.assert.notCalled(method1HandlerB);
      sinon.assert.notCalled(method2HandlerB);
    });

    it('should be able to route multiple messages to the same component once registered.', () => {
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
        router.handleDirective(validDirective);
        router.handleDirective(validDirective);
      }).not.to.throw();
      sinon.assert.calledTwice(method1HandlerA);
      sinon.assert.notCalled(method1HandlerB);
      sinon.assert.notCalled(method2HandlerB);
    });

    it('should be able to route message with all components registered.', () => {
      expect(() => {
        registries1.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        });
        router.handleDirective(validDirective);
      }).not.to.throw();
      sinon.assert.calledOnceWithExactly(method1HandlerA, {});
      sinon.assert.notCalled(method1HandlerB);
      sinon.assert.notCalled(method2HandlerB);
    });

    it('should be able to return the expected values for canHandle with single registry when validateNamespaceVersion returns true', () => {
      versionManager.validateNamespaceVersion = sandbox.stub().returns(true);
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
      }).not.to.throw();
      assert.strictEqual(router.canHandle(validDirective), true);
    });

    it('should not pass canHandle check if validateNamespaceVersion returns false', () => {
      versionManager.validateNamespaceVersion = sandbox.stub().returns(false);
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
      }).not.to.throw();
      assert.strictEqual(router.canHandle(validDirective), false);
      assert.strictEqual(router.canHandle(invalidDirective), false);
    });

  });

  describe('unregister functionality', () => {
    it('should be able to unregister any registered class.', () => {
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
        router.removeNamespace(registry1.namespace);
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 0);
    });

    it('should throw a warning if attempting to unregister an unregistered class.', () => {
      expect(() => {
        router.removeNamespace(registry1.namespace);
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 0);
    });

    it('should be able to unregister all classes belonging to the specified namespace.', () => {
      expect(() => {
        registries2.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        });
        router.removeNamespace(registries2[0].namespace);
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 0);
    });

    it('should add only one entry to the router if it has a duplicate version and remove it from the VersionManager', () => {
      expect(() => {
        registries2.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
        });
        router.removeNamespace(registries2[1].namespace);
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 0);
    });
  });

  describe('invalid routing functionality', () => {
    it('should throw a warning if handler is not registered and not route the message.', () => {
      router.handleDirective(validDirective);
      sinon.assert.notCalled(method1HandlerA);
      sinon.assert.notCalled(method1HandlerB);
      sinon.assert.notCalled(method2HandlerB);
    });

    it('should throw a warning if handler was registered and unregistered after and not route the message.', () => {
      router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
      router.removeNamespace(registry1.namespace);
      router.handleDirective(validDirective);
      sinon.assert.notCalled(method1HandlerA);
      sinon.assert.notCalled(method1HandlerB);
      sinon.assert.notCalled(method2HandlerB);
    });
  });

  describe('validate routing functionality along with IPC namespace-version validation', () => {
    registries1.forEach((x) => {
      it(`should register ${x.handler.name} to the router and add ${x.handler.name} to the VersionManager `, () => {
        expect(() => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
          sandbox.assert.calledOnceWithExactly(versionManagerAddNamespaceVersionEntryStub, x.version, x.namespace)
        }).not.to.throw();
        assert.strictEqual(router.handler.size, 1);
      });
    });

    it('should register all classes to the router and add all classes to the VersionManager', () => {
      expect(() => {
        registries1.forEach((x) => {
          router.addNamespace(new x.handler(logger) as DirectiveHandler);
          sandbox.assert.calledWithExactly(versionManagerAddNamespaceVersionEntryStub, x.version, x.namespace)
        });
      }).not.to.throw();
      assert.strictEqual(router.handler.size, registries1.length);
    });

    it('should be able to unregister any registered class and remove it from the VersionManager', () => {
      expect(() => {
        router.addNamespace(new registry1.handler(logger) as DirectiveHandler);
        sandbox.assert.calledWithExactly(versionManagerAddNamespaceVersionEntryStub, registry1.version, registry1.namespace)
        router.removeNamespace(registry1.namespace);
        sandbox.assert.calledWithExactly(versionManagerRemoveNamespaceVersionEntryStub, registry1.namespace)
      }).not.to.throw();
      assert.strictEqual(router.handler.size, 0);
    });
  });

});
