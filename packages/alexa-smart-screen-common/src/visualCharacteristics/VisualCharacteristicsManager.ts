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

import { LoggerParamsBuilder } from "../logger/LoggerParamsBuilder";
import { ILogger } from "../logger/ILogger";
import { IDisplayCharacteristics } from "./deviceDisplay/IDisplayCharacteristics";
import { IInteractionMode, SupportedType, UIMode } from "./interactionModes/IInteractionMode";
import { IDerivedWindowCharacteristics } from "./IWindowDerivedCharacteristics";
import { IWindowInstance } from "../window/IWindowInstance";
import { IWindowContinuousSize, IWindowDiscreteSize, IWindowSizeConfiguration, WindowSizeType } from "./windowTemplates/IWindowSize";
import { IWindowTemplate, WindowType } from "./windowTemplates/IWindowTemplate";
import { IWindowDimensions } from "../window/IWindowDimensions";
import { Calculator } from "../utils/Calculator";
import { Logger } from "../logger/Logger";
import { LogHandlerManager } from "../logger/LogHandlerManager";

export class VisualCharacteristicsManager {
    protected static readonly CLASS_NAME = 'VisualCharacteristicsManager';
    private static instance : VisualCharacteristicsManager;
    protected displayCharacteristics : IDisplayCharacteristics;
    protected interactionModes : Map<string, IInteractionMode>;
    protected windowTemplates : Map<string, IWindowTemplate>;
    protected windowSizeConfigurations : Map<string, IWindowSizeConfiguration>;
    protected logger : ILogger;

    public static getInstance() : VisualCharacteristicsManager {
        if (!VisualCharacteristicsManager.instance) {
            VisualCharacteristicsManager.instance = new VisualCharacteristicsManager();
          }
          return VisualCharacteristicsManager.instance;
    }

    private constructor() {
        this.logger = new Logger(VisualCharacteristicsManager.CLASS_NAME, new LogHandlerManager());
        this.interactionModes = new Map();
        this.windowTemplates = new Map();
        this.windowSizeConfigurations = new Map();
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(VisualCharacteristicsManager.CLASS_NAME);
    }

    public setLogger(logger : ILogger) {
        this.logger = logger;
    }

    public setDisplayCharacteristics(displayCharacteristics : IDisplayCharacteristics) : void {
        this.displayCharacteristics = displayCharacteristics;
    }

    public getDisplayCharacteristics() : IDisplayCharacteristics {
        return this.displayCharacteristics;
    }

    public setInteractionModes(interactionModes : IInteractionMode[]) : void {
        interactionModes.forEach((interactionMode : IInteractionMode) => {
            this.interactionModes.set(interactionMode.id, interactionMode);
        });
    }

    public getInteractionModes() : IterableIterator<IInteractionMode> {
        return this.interactionModes.values();
    }

    public setWindowTemplates(windowTemplates : IWindowTemplate[]) : void {
        windowTemplates.forEach((windowTemplate : IWindowTemplate) => {
            this.windowTemplates.set(windowTemplate.id, windowTemplate);
            windowTemplate.configuration.sizes.forEach((windowSizeConfiguration : IWindowSizeConfiguration) => {
                this.windowSizeConfigurations.set(windowSizeConfiguration.id, windowSizeConfiguration);
            });
        });
    }

    public getWindowTemplates() : IterableIterator<IWindowTemplate> {
        return this.windowTemplates.values();
    }

    public getDerivedWindowCharacteristics(windowInstance : IWindowInstance) : IDerivedWindowCharacteristics | null {
        const functionName = 'getDerivedWindowCharacteristics';
        if (this.windowTemplates.size === 0 || this.interactionModes.size === 0 || this.windowSizeConfigurations.size === 0) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Uninitialized characteristics')
                                .setArg('windowTemplates', this.windowTemplates)
                                .setArg('interctionModes', this.interactionModes)
                                .setArg('sizeConfigurations', this.windowSizeConfigurations)
                                .build());
            return null;
        }

        const windowTemplate = this.windowTemplates.get(windowInstance.templateId);
        const displayType : WindowType = windowTemplate.type;
        if (!windowTemplate) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Unable to find window template')
                                .setArg('templateId', windowInstance.templateId)
                                .build());
            return null;
        }

        const sizeConfigurationsInTemplate = windowTemplate.configuration.sizes;
        const isSizeConfigurationIdValid = sizeConfigurationsInTemplate.some((sizeConfiguration) => {
            return sizeConfiguration.id === windowInstance.sizeConfigurationId;
        });
        if (!isSizeConfigurationIdValid) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Invalid size configuration ID')
                                .setArg('sizeConfigurationId', windowInstance.sizeConfigurationId)
                                .build());
            return null;
        }

        const interactionModesInTemplate = windowTemplate.configuration.interactionModes;
        const isInteractionModeValid = interactionModesInTemplate.includes(windowInstance.interactionMode);
        if (!isInteractionModeValid) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Invalid interaction mode')
                                .setArg('interactionMode', windowInstance.interactionMode)
                                .build());
            return null;
        }

        const sizeConfiguration = this.windowSizeConfigurations.get(windowInstance.sizeConfigurationId);
        if (!sizeConfiguration) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Unable to find size configuration')
                                .setArg('sizeConfigurationId', windowInstance.sizeConfigurationId)
                                .build());
            return null;
        }

        const dimensions : IWindowDimensions = {
            width : undefined,
            height : undefined
        };
        const sizeType = sizeConfiguration.type;

        if (sizeType === WindowSizeType.CONTINUOUS) {
            const windowSize : IWindowContinuousSize =
            sizeConfiguration as IWindowContinuousSize;
            dimensions.minHeight = windowSize.minimum.value.height;
            dimensions.maxHeight = windowSize.maximum.value.height;
            dimensions.minWidth = windowSize.minimum.value.width;
            dimensions.maxWidth = windowSize.maximum.value.width;

            dimensions.width = Calculator.getValueInRange(dimensions.minWidth, dimensions.maxWidth, window.innerWidth) || 0;
            dimensions.height = Calculator.getValueInRange(dimensions.minHeight, dimensions.maxHeight, window.innerHeight) || 0;
       } else if (sizeType === WindowSizeType.DISCRETE) {
            const discreteSizeConfiguration = sizeConfiguration as IWindowDiscreteSize;
            dimensions.height = discreteSizeConfiguration.value.value.height;
            dimensions.width = discreteSizeConfiguration.value.value.width;
            dimensions.minHeight = dimensions.height;
            dimensions.maxHeight = dimensions.height;
            dimensions.minWidth = dimensions.width;
            dimensions.maxWidth = dimensions.width;
       }

        const interactionMode = this.interactionModes.get(windowInstance.interactionMode);
        if (!interactionMode) {
            this.logger.error(VisualCharacteristicsManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('Unable to find interaction mode')
                                .setArg('interactionMode', windowInstance.interactionMode)
                                .build());
            return null;
        }

        const disallowVideo = interactionMode.videoSupported === SupportedType.UNSUPPORTED;
        const uiMode = interactionMode.uiMode ? interactionMode.uiMode : UIMode.HUB;

        const derivedWindowCharacteristics : IDerivedWindowCharacteristics = {
            dimensions,
            displayType,
            sizeType,
            disallowVideo,
            uiMode
        }
        return derivedWindowCharacteristics;
    }
}